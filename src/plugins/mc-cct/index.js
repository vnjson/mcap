import "./style.css";


let HOST;
let $tpl;

export default function (){}

vnjs.once('postload', () => {
    HOST = vnjs.package['mc-cct'];
    if(HOST){
        $tpl = $(`<iframe class="mc-cct__vnjson component" src="${HOST}" width="600" height="400"></iframe>`);
        vnjs.store.screen.append($tpl);
    }
    else{
        vnjs.emit('vnjson.error', '$root/package.yaml | mc-cct: http://localhost:PORT/');
    }
    
})
vnjs.on('mc-cct', (args) => {
    if(args){
        $tpl.show();
    }
    else{
        $tpl.hide();
    }
})