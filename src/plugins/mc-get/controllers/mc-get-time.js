import Time from '../Time.js';
/**
 * mc-get-time
 */
const time = new Time('wordtime');
export default function (args){
    const { WORLD } = vnjs.store.MINECRAFT;
    if(!WORLD){
        vnjs.emit('vnjson.error', "Необходимо вызвать mc-get - request: WORLD");
    }

    time.wordtime = WORLD.worldTime;
    time.parse(args);
}