
-- Created by IntelliJ IDEA.
require "import"

local FileUtils = import "androlua.common.LuaFileUtils"

import "android.support.design.widget.CoordinatorLayout"
import "android.support.v4.view.MotionEventCompat"
import "android.view.MotionEvent"
local uihelper = require "uihelper"
local JSON = require "cjson"

local function newInstance()
    -- create view table
    local layout = {
        CoordinatorLayout,
        layout_width = "fill",
        layout_height = "fill",
        focusable = true,
        focusableInTouchMode = true,
        {
            LinearLayout,
            layout_width = "fill",
            layout_height = "fill",
            gravity = "center_horizontal",
            orientation = 1,
            paddingLeft = "16dp",
            paddingRight = "16dp",
            {
                RelativeLayout,
                layout_height = "48dp",
                layout_width = "fill",
                layout_marginLeft = "16dp",
                layout_marginTop = "36dp",
                layout_marginRight = "8dp",
                {
                    TextView,
                    id = "tv_date",
                    text = "23月33日 333",
                    textSize = "14sp",
                    layout_centerVertical = true,
                    textColor = "#aa333333",
                },
                {
                    ImageView,
                    id = "iv_setting",
                    layout_height = "48dp",
                    layout_width = "48dp",
                    padding = "12dp",
                    scaleType = "center",
                    src = "@drawable/ic_setting",
                    layout_alignParentRight = true,
                }
            },
            {
                RecyclerView,
                id = "recyclerView",
                layout_width = "fill",
                layout_marginTop = "16dp",
                layout_marginLeft = "8dp",
                layout_marginRight = "8dp",
                overScrollMode = 2,
                fadingEdgeLength = 0,
                verticalFadingEdgeEnabled = false,
                horizontalFadingEdgeEnabled = false,
            },
        },
    }
    local sp = activity.getSharedPreferences("luandroid", Context.MODE_PRIVATE)
    local item_view = {
        RelativeLayout,
        layout_height = "70dp",
        background = "@drawable/layout_selector_tran",
        {
            ImageView,
            id = "icon",
            layout_width = "40dp",
            layout_height = "40dp",
            layout_marginTop = "6dp",
            layout_centerHorizontal = true,
        },
        {
            TextView,
            id = "text",
            layout_below = "icon",
            textColor = "#444444",
            textSize = "9sp",
            gravity = "center",
            layout_width = "fill",
            layout_height = "22dp",
        },
        {
            ImageView,
            layout_alignParentRight = true,
            id = "ic_del",
            layout_marginRight = "2dp",
            layout_width = "24dp",
            layout_height = "24dp",
            src = "@drawable/ic_clear",
            visibility = 'gone',
        },
    }
    local hadLoadData
    local isVisible
    local lastId
    local data = {}
    local ids = {}
    local config = {}
    local isDragging = false
    local weeks = { "星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六" }
    local adapter
    local touchHelper
    local gd = GradientDrawable()
    gd.setShape(GradientDrawable.OVAL)
    gd.setColor(0xFFFFFFFF)

    local function newActivity(luaPath)
        local intent = Intent(activity, LuaActivity)
        intent.putExtra("luaPath", luaPath)
        activity.startActivity(intent)
    end

    local function saveConfig(config)
        sp.edit().putString("config", JSON.encode(config)).apply()
    end

    local function getAdapter(mData, changeColor, getItemCountFunc, getTouchHelperFunc)
        return LuaRecyclerAdapter(luajava.createProxy('androlua.adapter.LuaRecyclerAdapter$AdapterCreator', {
            getItemCount = getItemCountFunc,
            getItemViewType = function(position) return 0 end,
            onCreateViewHolder = function(parent, viewType)
                local views = {}
                local holder = LuaRecyclerHolder(loadlayout(item_view, views, RecyclerView))
                holder.itemView.setTag(views)
                holder.itemView.getLayoutParams().width = ids.recyclerView.getWidth() / 5 - 1
                holder.itemView.setOnTouchListener(luajava.createProxy('android.view.View$OnTouchListener', {
                    onTouch = function(v, event)
                        if isDragging and MotionEventCompat.getActionMasked(event) == MotionEvent.ACTION_DOWN then
                            getTouchHelperFunc().startDrag(holder)
                        end
                        return false
                    end
                }))
                holder.itemView.setOnLongClickListener(luajava.createProxy('android.view.View$OnLongClickListener', {
                    onLongClick = function(v)
                        isDragging = true
                        adapter.notifyDataSetChanged()
                        return true
                    end
                }))
                holder.itemView.onClick = function()
                    local p = holder.getAdapterPosition() + 1
                    local item = mData[p]
                    newActivity(item.launchPage)
                end
                views.ic_del.onClick = function()
                    local p = holder.getAdapterPosition()
                    local id
                    if p + 1 <= #data then
                        id = data[p + 1].id
                        table.remove(data, p + 1)
                        adapter.notifyItemRemoved(p)
                    end
                    if id then FileUtils.removePlugin(id) end
                end
                return holder
            end,
            onBindViewHolder = function(holder, position)
                position = position + 1
                local views = holder.itemView.getTag()
                local item = mData[position]
                if views == nil or item == nil then return end
                if isDragging then
                    views.ic_del.setScaleX(0)
                    views.ic_del.setScaleY(0)
                    views.ic_del.setVisibility(0)
                    views.ic_del.animate().scaleX(1).scaleY(1).start()
                else
                    views.ic_del.setVisibility(8)
                end

                local icon = item.icon
                local radius = tonumber(config.home_icon_radius or '40')
                LuaImageLoader.loadWithRadius(views.icon, radius, icon)
                views.text.setText(item.text)
                local alpha = tonumber(config.home_bg_alpha or 9)
                if changeColor and alpha <= 5 then
                    views.text.setTextColor(0xFFFFFFFF)
                else
                    views.text.setTextColor(0xFF444444)
                end
            end,
        }))
    end

    local function getTouchHelperCallback(mData, mAdapter)
        return DragTouchHelper(luajava.createProxy('pub.hanks.sample.adapter.DragTouchHelper$Creator', {
            onMove = function(rec, holder, target)
                local fromPosition = holder.getAdapterPosition() + 1
                local toPosition = target.getAdapterPosition() + 1
                local tmp = mData[fromPosition]
                table.remove(mData, fromPosition)
                table.insert(mData, toPosition, tmp)
                mAdapter.notifyItemMoved(fromPosition - 1, toPosition - 1)
            end,
            isLongPressDragEnabled = function() return false end,
            clearView = function(rec, holder)
                local sortApps = {}
                for i = 1, #mData do
                    sortApps[#sortApps + 1] = mData[i].id
                end
                config.sortApps = sortApps
                saveConfig(config)
            end,
            getDragFlags = function() return 0xF end,
            getSwipeFlags = function() return 0 end,
        }))
    end

    local function getData()
        for k, v in pairs(data) do
            data[k] = nil
        end
        config = JSON.decode(sp.getString('config', '{}'))
        local sortApps = config.sortApps or {}
        local localList = LuaFileUtils.getPluginList()
        for i = 1, #localList do
            local p = localList[i - 1]
            local item = {
                id = p.getId(),
                text = p.getName(),
                launchPage = p.getMainPath(),
                icon = p.getIconPath(),
                position = 9999 + i,
            }
            data[#data + 1] = item
            for j = 1, #sortApps do
                if sortApps[j] == item.id then
                    item.position = j
                end
            end
        end
        -- sort
        table.sort(data, function(l, r) return l.position < r.position end)
        adapter.notifyDataSetChanged()

        -- save new config
        local newSortApps = {}
        for i = 1, #data do
            newSortApps[#newSortApps + 1] = data[i].id
        end
        config.sortApps = newSortApps
        saveConfig(config)
    end

    local function isDraggingIcons()
        return isDragging
    end

    local function setDraggingIcons(drag)
        isDragging = drag
    end

    adapter = getAdapter(data, true, function() return #data end, function() return touchHelper end)
    local fragment = LuaFragment.newInstance()
    fragment.setCreator(luajava.createProxy('androlua.LuaFragment$FragmentCreator', {
        onCreateView = function(inflater, container, savedInstanceState)
            return loadlayout(layout, ids)
        end,
        onViewCreated = function(view, savedInstanceState)
            ids.recyclerView.setLayoutManager(GridLayoutManager(activity, 5))
            ids.recyclerView.setAdapter(adapter)
            touchHelper = ItemTouchHelper(getTouchHelperCallback(data, adapter))
            touchHelper.attachToRecyclerView(ids.recyclerView)

            ids.tv_date.setText(os.date('%m月%d日 ') .. weeks[os.date('%w') + 1])
            ids.iv_setting.onClick = function(view)
                newActivity(luajava.luadir .. '/activity_setting.lua')
            end

            getData()
        end,
    }))
    return fragment, adapter, getData, isDraggingIcons, setDraggingIcons
end

return {
    newInstance = newInstance
}
