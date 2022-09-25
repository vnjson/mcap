/**
 * web-modem
 */

let HOST;
vnjs.once('postload', () => {
    HOST = vnjs.package['web-modem']
});
export default function (args){
  
   if(!HOST){
        vnjs.emit('vnjson.error', 'web-modem: http://127.0.0.1:60000/ to  $root/pacakge.yaml ');
        return;
   }
   const id = vnjs.plugins.data.stringToData(args.id);
   const path = vnjs.plugins.data.stringToData(args.path);
   const data = {}
   for(let key in args.args){
        data[key] = vnjs.plugins.data.stringToData( args.args[key] )
   }
   const urlParams = new URLSearchParams(data).toString(); 
   const URL = `${HOST}${id}/${path}?${urlParams}`

   const params = {
        method: 'GET',
        mode: 'no-cors',
        headers: {
           'Content-Type': 'text/plain'
        },
   }
   
   fetch(URL, params)
        .catch(err => console.error(err))
       
}

/**
-- cctweb.lua
-- http://localhost:60000/0/player?id=1&name=nemo
local device = peripheral.wrap('left')
while true do
  local ev, code, path, arg1, arg2 = os.pullEvent("webModem_request")
  if code~=nil and arg1 ~= nil and arg2 ~= nil then
    local replay = "200: "..path..","..arg1..","..arg2
    print(replay)
    --device.sendReply(code,200,replay)
  end
end
 */