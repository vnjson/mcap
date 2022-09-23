/**
 * mc-get-biome
 */
 export default function (args){
    
    const { WORLD } = vnjs.store.MINECRAFT;
    if(!WORLD){
        vnjs.emit('vnjson.error', "Необходимо вызвать mc-get - request: WORLD");
        return;
    }
    let flag = false;
    for(let key in args){
        if(key!=='default'&&key===WORLD.worldBiome){
            flag = true;
            vnjs.exec(args[key]);
        }
    }
    if(!flag){
        vnjs.exec(args.default);
    }
}