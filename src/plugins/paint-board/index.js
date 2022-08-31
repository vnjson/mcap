import './style.css'

export default function (){

vnjs.on('vnjson.mount', ()=>{
    if(this.package['paint-board']){
      init()
    }

})

var init = () => {

    const $tpl = $('<iframe id="paint-board__vnjson" src="data/paint-board/index.html" width="800" height="500"></iframe>');
    vnjs.store.screen.append($tpl);  
    vnjs.on('paint-board', imgID => {
        if(imgID){
              $tpl.show();
              const url = vnjs.getAssetByName(imgID).url
              const IMG = `${location.protocol}//${location.host}/${url}`
              const win = document.querySelector("iframe#paint-board__vnjson").contentWindow;
              win.postMessage({ IMG }, location.origin+"/data/paint-board/index.html");
        }
        else{
          $tpl.hide();
        }
    })

}



}