import Time from '../Time.js';
/**
 * mc-get-time
 */
const time = new Time('localtime');
export default function (args){
    const { WORLD } = vnjs.store.MINECRAFT;
    if(!WORLD){
        vnjs.emit('vnjson.error', "Необходимо вызвать mc-get - request: WORLD")
    }

    time.localtime = WORLD.worldTime
    time.parse(args)
}