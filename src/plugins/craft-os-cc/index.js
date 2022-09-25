import "./style.css";


let HOST;
let $tpl;

export default function (){}

vnjs.once('postload', () => {
    HOST = vnjs.package['craft-os-cc'];
    if(HOST){
        $tpl = $(`<iframe class="craft-os-cc__vnjson component" src="${HOST}" width="600" height="400"></iframe>`);
        vnjs.store.screen.append($tpl);
    }
    else{
        vnjs.emit('vnjson.error', '$root/package.yaml | craft-os-cc: http://localhost:PORT/');
    }
    
})
vnjs.on('craft-os-cc', (args) => {
    if(args){
        $tpl.show();
    }
    else{
        $tpl.hide();
    }
})