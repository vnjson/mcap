import Time from '../Time.js';
/**
 * mc-get-date
 */
const date = new Time('localdate');
export default function (args){
    const { WORLD } = vnjs.store.MINECRAFT;
    if(!WORLD){
        vnjs.emit('vnjson.error', "Необходимо вызвать mc-get - request: WORLD")
    }

    date.localdate = WORLD.worldDate
    date.parse(args)
}