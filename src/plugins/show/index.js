import "./style.css";

export default function (){

  let $left = $('<div class="vnjson__show-left component"></div>')
  let $right = $('<div class="vnjson__show-right component"></div>')
  let $center = $('<div class="vnjson__show-center component"></div>')
  let $show = $('<div class="vnjson__show-show component"></div>')


  this.$store.$screen.append($left)
  this.$store.$screen.append($right)
  this.$store.$screen.append($center)
/*

.vnjson__show-show.component
 */
  this.on('left', id=>{
    
    if(id){    
      $left.hide()
      $left.css('background-image', `url('${this.getAssetByName(id).url}')` ).fadeIn()
    }
    else{
       $left.fadeOut()
    }
  })
  this.on('center', id=>{
   
    if(id){
      $center.hide()
      $center.css('background-image', `url('${this.getAssetByName(id).url}')` ).fadeIn()
    }
    else{
      $center.fadeOut()
    }
  })
  this.on('right', id=>{
    if(id){
      $right.hide()
      $right.css('background-image', `url('${this.getAssetByName(id).url}')` ).fadeIn()
    }
    else{
      $right.fadeOut()
    }
  })
  this.on('show', param=>{
    if(param){

     $show.css('background-image', `url('${this.getAssetByName(id).url}')` )
          .css(param.css).fadeIn()
    }
    else{
      $show.fadeOut()
    }
   
  })
}