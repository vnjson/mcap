import './style.css'
const $tpl = $('<div class="vnjson__blocks component"></div>')
let stepsArray = []
export default  function () {

  this.$store.$screen.append($tpl)
  this.on('blocks', (param) => {
    stepsArray = param
    blocksHandler.call(this, stepsArray)
  })
  this.on('blocks-step', blocksStepHandler)
}

function blocksHandler (param){
    if(param){
          $tpl.show()
          param.forEach( item => {
              const imageURL = this.getAssetByName(item.image).url
              const $imgWrapper = $(`
                        <div class="vnjson__blocks-item component vnjson__blocks--${item.id}" >
                                <div class="vnjson__blocks-wrapper-item vnjson__blocks-wrapper--${item.id}">
                                    <img alt=""  src="${imageURL}">
                                </div>
                        </div>`)
              
              $imgWrapper.css({
                width: item.width,
                height: item.height,
                left: item.left,
                top: item.top,
                display: 'block'
              })
              if(item['z-index']){
                $imgWrapper.css('z-index', item['z-index'])
              }
              const $img = $imgWrapper.find('img')
              const $imgBox = $imgWrapper.find(`.vnjson__blocks-wrapper--${item.id}`)
              $img.css({
                  display: 'none',
                  width: item.width,
                  height: item.height,
                  left: 0,
                  top: 0,
                  opacity: 0
              })
              $tpl.append($imgWrapper)
              /**
               * item.animation
               */
                setTimeout( ()=>{
                    if(item.animation){
                        animationType.call(this, $imgWrapper, $img, $imgBox, item)
                    }
                    else{
                        $img.css({ opacity: '1', display: 'block'})
                    }
                }, item.timeout + 100)


          })
    }
    else{
          $tpl.hide()
          $tpl.empty()
    }
}



function animationType ($imgWrapper, $img, $imgBox, item){

    switch (item.animation.type){
        /**
         * slide
         */
        case 'slideUp':
            $img.css({ display: 'block'})
            $imgBox.css({top: '-100%'})
            $img.animate({ opacity: 1 }, item.animation.duration)
            $imgBox.animate({ top: "0%" }, item.animation.duration, () => {
                if(item.animation.onEnd){
                    this.exec(item.animation.onEnd)
                }
            })
            break
        case 'slideDown':
            $img.css({ display: 'block'})
            $imgBox.css({top: '100%'})
            $img.animate({ opacity: 1 }, item.animation.duration)
            $imgBox.animate({ top: "0%" }, item.animation.duration, () => {
                if(item.animation.onEnd){
                    this.exec(item.animation.onEnd)
                }
            })
            break
        case 'slideLeft':
            $img.css({ display: 'block'})
            $imgBox.css({left: '-100%'})
            $img.animate({ opacity: 1 }, item.animation.duration)
            $imgBox.animate({ left: "0%" }, item.animation.duration, () => {
                if(item.animation.onEnd){
                    this.exec(item.animation.onEnd)
                }
            } )
            break
        case 'slideRight':
            $img.css({ display: 'block'})
            $imgBox.css({left: '100%'})
            $img.animate({ opacity: 1 }, item.animation.duration)
            $imgBox.animate({ left: "0%" }, item.animation.duration, () => {
                if(item.animation.onEnd){
                    this.exec(item.animation.onEnd)
                }
            } )
            break
        /**
         * show
         */
  

        case 'showUp':
            $img.css({opacity: 1, display: 'block'})
            $imgBox.css( { height: '0px', top: '0px', bottom: 'unset', 'align-items': 'flex-start'  } )
            $imgBox.animate({ height: item.height }, item.animation.duration, () => {
                if(item.animation.onEnd){
                    this.exec(item.animation.onEnd)
                }
            })
            break
        case 'showDown':
            $img.css({opacity: 1, display: 'block'})
            $imgBox.css( { height: '0px', top: 'unset', bottom: '0px', 'align-items': 'flex-end'  } )
            $imgBox.animate({ height: item.height }, item.animation.duration, () => {
                if(item.animation.onEnd){
                    this.exec(item.animation.onEnd)
                }
            })
            break
        case 'showLeft':
            $img.css({opacity: 1, display: 'block'})
            $imgBox.css( { width: '0px', left: '0px',  right: 'unset', 'justify-content': 'flex-start'  } )
            $imgBox.animate({ width: item.width }, item.animation.duration, () => {
                if(item.animation.onEnd){
                    this.exec(item.animation.onEnd)
                }
            })
            break
        case 'showRight':
            $img.css({opacity: 1, display: 'block'})
            $imgBox.css( { width: '0px', right: '0px', left: 'unset', 'justify-content': 'flex-end' } )
            $imgBox.animate({ width: item.width }, item.animation.duration, () => {
                if(item.animation.onEnd){
                    this.exec(item.animation.onEnd)
                }
            })
            break
        /**
         * move
         */
        case 'moveTo':
            $img.css({ display: 'block', opacity: 1})
            const animationData = {}
            if(item.animation.left){
              animationData.left = item.animation.left
            }
            if(item.animation.top){
              animationData.top = item.animation.top
            }
            $imgWrapper.animate(animationData, item.animation.duration, ()=>{
                if(item.animation.onEnd){
                    this.exec(item.animation.onEnd)
                }
            } )
            break
        /**
         * zoom
         */
        case 'zoom':
            $img.css({ display: 'block', opacity: 1})

            const animationData2 = {
                    transform: `scale(${item.animation.value})`,
                    transition: `${item.animation.duration/1000}s`
            }

            $imgWrapper.css(animationData2)
            if(item.animation.onEnd){
                setTimeout(()=>{
                  this.exec(item.animation.onEnd)
                }, item.animation.duration)
            }
            break
        /**
         * fade
         */
        case 'fadeIn':
            $img.css({ display: 'block'})
            $img.animate({  opacity: 1 }, item.animation.duration, ()=>{
                if(item.animation.onEnd){
                    this.exec(item.animation.onEnd)
                }
            } )
            break
        case 'fadeOut':
            $img.css({  opacity: 1, display: 'block'})
            $img.animate({  opacity: 0 }, item.animation.duration, ()=>{
                if(item.animation.onEnd){
                    this.exec(item.animation.onEnd)
                }
            } )
            break
        default:
            this.exec({'$': `<font color="red">Неверный тип анимации ${JSON.stringify( item.animation.type )}</font>`})

    }
}


function blocksStepHandler (item){

    const $imgWrapper = $(`.vnjson__blocks--${item.id}`)
    const $img = $imgWrapper.find('img')
    const $imgBox = $imgWrapper.find(`.vnjson__blocks-wrapper--${item.id}`)
    if(item.image){
        $img.attr('src',   this.getAssetByName(item.image).url )
    }
    
    if(item['z-index']){
        $imgWrapper.css('z-index', item['z-index'])
    }


    setTimeout( ()=>{
        if(item.animation){
            animationType ($imgWrapper, $img, $imgBox, item)
        }
        else{
            $img.css({ opacity: '1', display: 'block'})
        }
    }, item.timeout + 100)
}