/**
 * mc-get-print-pos
 */
export default function (args){
    const IDs = ['computercraft:printout'];
    const { TYPE } = vnjs.store.MINECRAFT;
    const ITEM = vnjs.store.MINECRAFT[TYPE];

        
    if(!IDs.includes(ITEM.data.id)) {
        vnjs.exec(args.default);
        return;
    }
    const { title, pages } = ITEM.data.tag
    if(title!==args.title){
        vnjs.exec(args.default);
        return;
    }
    const lines = [];
    for(let key in ITEM.data.tag){
        if(key.includes('line')){
            const value = ITEM.data.tag[key].trim();
            const _key = key.replace('line', '');
            lines[_key] = value;
        }
    }
    const excludeProps = ['title', 'page', 'string', 'start', 'length', 'default'];
    const _pages = [];
    let countStr = 0;
    let page = 0;
    lines.forEach( (line) => {
        _pages.push({ page, string: countStr, line })

        if(countStr === 20) {
            countStr = 0;
            page++
            return
        }
        countStr++;
    }) 
    let flag = false;
    for(let key in args){
        if(!excludeProps.includes(key)){
            
            const str = _pages.find( (item) => {
                
                if(item.page === args.page-1&& item.string === args.string-1){
                    return true
                }
            });
            const chunk = str.line.split('').splice(args.start-1, args.length).join("")
            if(chunk === key){
                flag = true
                vnjs.exec(args[key])
            }
           
        }
    
    }
    if(!flag){
        vnjs.exec(args.default)
    }
}