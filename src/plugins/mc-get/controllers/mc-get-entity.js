/**
 * mc-get-entity
 */
export default function (args){
    const { TYPE } = vnjs.store.MINECRAFT;
    if(TYPE!=='ENTITY'){
        vnjs.emit('vnjson.error', 'request = ENTITY')
    }
    const ITEM = vnjs.store.MINECRAFT[TYPE];

    for(let key in args){
        switch (key){
            case "name":
                vnjs.state.data[args.name] = ITEM.data.name;
                break;
            case "type":
                vnjs.state.data[args.type] = ITEM.data.entityType;
                break;
            case "alive":
                vnjs.state.data[args.alive] = ITEM.data.alive;
                break;
            case "pos":
                const [x, z, y] = ITEM.data.nbt.Pos;
                vnjs.state.data[args.pos] = `${Math.floor(x)} ${Math.floor(z)} ${Math.floor(y)}`;
                break;
            case "health":
                vnjs.state.data[args.health] = ITEM.data.nbt.Health;
                break;
            case "invisible":
                vnjs.state.data[args.invisible] = ITEM.data.invisible;
                break;
            default:
                vnjs.emit('vnjson.error', `Свойство [ ${key} ] неподдерживается`);
        }
        
    }
  
}