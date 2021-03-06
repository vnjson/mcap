import './style.css'

import ErrorHandler from './ErrorHandler.js';



export default function  (){
	if(!this.debug) {
        $('body').attr('oncontextmenu', 'return false;')
        return
    }
    this.current.data.local = 'ru';        
    new ErrorHandler(this.current.data.local);  
  
    this.on('exec', ctx=>{
        /**
         * Добавляем параметры в URI
         */
        // убрал сцену по умолчанию, потому что на неё постоянно прыгало
        /*
        if(this.current.sceneName!==''){
            history.pushState(null, null, `?jump=${this.current.sceneName}.${this.current.labelName}`);
        }
        */
        /**
         * Проверяем существует ли плагин с таким именем
         * Исключая выражения - null | -false | - Hello world!
         */
        if(!ctx) return;
        if(typeof ctx==='object'){
                Object.keys(ctx).forEach(event=>{
                    if(!/^_/ig.test(event)&&!this.plugins.hasOwnProperty(event)){
                        this.emit('error', 'pluginNotFound', event);
                    }
                });
        }

    });

    this.on('error', (codeError, data)=>{

        const message = ErrorHandler.getMessage(this.current.data.local, codeError, data);

        const path = `${this.current.sceneName}.${this.current.labelName}`;
        
        const snippet = ErrorHandler.getSnippetFromCtx(this.ctx);
        ErrorHandler.showModal(message, path, snippet);
    })
    this.on('warn', (codeError, data)=>{
        const codes =  {
            NoWayOutOfTheLabel: `No way out of the label [ ${this.current.labelName} ]`
        }
     
        console.log(codes[codeError]);
    })


    
}
