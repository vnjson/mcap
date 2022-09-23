/**
 * mc-get-message
 */
export default function (args){


    const { WORLD } = vnjs.store.MINECRAFT;
    if(!WORLD){
        vnjs.emit('vnjson.error', "Необходимо вызвать mc-get - request: WORLD")
    }
    const messages = JSON.parse(WORLD.chatHistory);
    let flag = false;
    messages.forEach( (msg) => {
        //console.log(msg)
        for(let key in args){

            if(msg.split(' ')[0].includes(args.prefix) && msg.includes(key) && key !== 'prefix'){
                flag = true;
                vnjs.exec(args[key]);
            }
        }
    })
    if(!flag){
        vnjs.exec(args.default)
    }

}