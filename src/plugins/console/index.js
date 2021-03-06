

export default function (){
  let port = 8080
  const $tpl = $(`<iframe class="vnjson__console component" src="" width="1024" height="570"></iframe>`);

  $tpl.css({
        backgroundColor: '#000000'
  }) 

 
  this.on('postload', ()=>{

      if(this.TREE.$root.package['console-port']){
        port = this.TREE.$root.package['console-port']
      }
      const src = `http://localhost:${port}`
      $tpl.attr('src', src)
  })


  let once = true
  this.on('console', data=>{
      /**
       * once - почему то iframe не хочет загрузаться, если не прибегнуть
       * к такому решению
       */
        if(once){
           this.$store.$screen.append($tpl)
           once = false
        } 
        if(data){
            $tpl.show()
        }
        else{
          $tpl.hide()
        }
  });



}