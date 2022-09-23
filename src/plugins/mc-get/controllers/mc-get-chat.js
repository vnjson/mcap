/**
 * mc-get-message
 */
const excludeProps = ['prefix', 'last'];
let flag = false;

export default function (args){


    const { WORLD } = vnjs.store.MINECRAFT;
    if(!WORLD){
        vnjs.emit('vnjson.error', "Необходимо вызвать mc-get - request: WORLD")
        return
    }
    const messages = JSON.parse(WORLD.chatHistory);

    if(args.last){
        messageHandler(messages[0], args)
    }
    else{
        /**
         * last = false
         */
        messages.forEach( (msg) => {
            messageHandler(msg, args)
        })
    }

    if(!flag){
        vnjs.exec(args.default)
    }

}

function messageHandler (msg, args){
            //console.log(msg)
            for(let key in args){
                if(args.prefix){
                    if(msg.split(' ')[0].includes(args.prefix) && msg.includes(key) && !excludeProps.includes(key)){
                        flag = true;
                        vnjs.exec(args[key]);
                    }
                }
                else{
                    if(msg.includes(key) && !excludeProps.includes(key)){
                        flag = true;
                        vnjs.exec(args[key]);
                    }
                }

            }
}