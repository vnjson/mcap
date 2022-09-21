/**
 * mc-get-print-label
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

    const excludeProps = ['title', 'label',  'default'];

    let flag = false;
    for(let key in args){
        if(!excludeProps.includes(key)){
            
            const line = lines.find( (item) =>{
                if(item.split(' ')[0].includes(args.label)){
                    return true
                }
            })
            console.log(line)
            if(line&&line.includes(key) ){
                flag = true
                vnjs.exec(args[key])
            }
           
        }
    
    }
    if(!flag){
        vnjs.exec(args.default)
    }
}