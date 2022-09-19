
const controller = {
    '===': (localtime, value, execData, mode) => {
        if(mode==="localdate"){
            let localdate = new Date(localtime * 100000).toLocaleDateString();
            let val = new Date(value * 100000).toLocaleDateString();
            if(localdate === val){
                vnjs.exec(execData)
            }
            return;
        }
        if(localtime===value){
            vnjs.exec(execData)
        }
    },
    '>': (localtime, value, execData) => {
        if(localtime>value){
            vnjs.exec(execData)
        }
    },
    '<': (localtime, value, execData) => {
        if(localtime<value){
            vnjs.exec(execData)
        }
    },
    '!==': (localtime, value, execData, mode) => {
        if(mode==="localdate"){
            let localdate = new Date(localtime * 100000).toLocaleDateString();
            let val = new Date(value * 100000).toLocaleDateString();
            if(localdate !== val){
                vnjs.exec(execData)
            }
            return;
        }

        if(localtime!==value){
            vnjs.exec(execData)
        }
    },
    '<=': (localtime, value, execData, mode) => {
        
        if(mode === "localdate"){
            let localdate = new Date(localtime * 100000).toLocaleDateString();
            let val = new Date(value * 100000).toLocaleDateString();
            if(localdate === val){
                vnjs.exec(execData);
            }
            else if(localtime < value){
                vnjs.exec(execData);
            }
            return;
        }

        if(localtime<=value){
            vnjs.exec(execData)
        }
    },
    '>=': (localtime, value, execData, mode) => {
        if(mode === "localdate"){
            let localdate = new Date(localtime * 100000).toLocaleDateString();
            let val = new Date(value * 100000).toLocaleDateString();
            if(localdate === val){
                vnjs.exec(execData)
            }
            else if(localtime > value){
                vnjs.exec(execData)
            }
            return;
        }
        if(localtime>=value){
            vnjs.exec(execData)
        }
    },
    '[]': (localtime, value, execData) => {
        if( value[0] <= localtime && localtime <= value[1]){
            vnjs.exec(execData)
        }
    },
    '][': (localtime, value, execData) => {
        if(localtime < value[0] || localtime > value[1]){
            vnjs.exec(execData)
        }
    }
}


class Time {
    operators = [
        "===",
        "<",
        ">",
        ">=",
        "<=",
        "!==",
        "\\[\\]",
        "\\]\\[",
        //'default'
    ];
    dataValue = null;
    value = null;
    OPERATOR = null;
    equal = null;
    PLUGIN_DATA = null;
    #wordTime = null;
    #wordDate = null;
    constructor(mode) {
        this.mode = mode;
    }
    parse(data) {
        this.PLUGIN_DATA = data;
        /**
         * Пробегаемся по всем условиям
         */
        for (let equal in this.PLUGIN_DATA) {
            this.equal = equal;
            /**
             * Определяем какой оператор используется в пользовательских данных
             */

            for (let i = 0; i < this.operators.length; i++) {
                const operator = this.operators[i];
                const isOperator = new RegExp(operator).test(this.equal);

                if (isOperator) {
                    this.OPERATOR = operator;
                }
            }
            if (this.OPERATOR === null) {
                vnjs.emit("error", {
                    ru: `Некоректный оператор <font color="deepskyblue">${
                        this.equal
                    }</font><br>Допустимые операторы <font color="lightgreen">${this.operators
                        .join("  ")
                        .replaceAll("\\", "")}</font>`,
                    en: `Invalid operator <font color="deepskyblue">${
                        this.equal
                    }</font><br>ValidoOperators <font color="lightgreen">${this.operators
                        .join("  ")
                        .replaceAll("\\", "")}</font>`,
                });
                return;
            }
            if (this.OPERATOR.includes("\\")) {
                this.OPERATOR = this.OPERATOR.replaceAll("\\", "");
            }
            console.log(this.OPERATOR)
          
            const [ key, val ] = this.equal.split(this.OPERATOR);
            if(this.mode==='localdate'){
                this.dateEval(val)
            }
            if(this.mode==='localtime'){
                this.timeEval(val)
            }

        }
    }
    timeEval (val){
            /**
             * Определяем диапазон ли лежит в значении
             */
            if(val.includes('--')){
                this.value = val.split('--').map( (item) => {
                    return Number( item.replace('-', '').trim() )
                });
            }
            else{
                this.value = Number( val.trim().replace('-', '') );
            }
 
            const execData = this.PLUGIN_DATA[this.equal];
            controller[this.OPERATOR](this.localtime, this.value, execData)
    }
    get localtime (){
        console.log(this.#wordTime)
        const [ hh, mm ] = this.#wordTime.split("-");
        return  Number(hh+mm);
    }
    set localtime (val){
        this.#wordTime = val;
    }
    dateEval (val){
             /**
             * Определяем диапазон ли лежит в значении
             */
            if(val.includes('--')){
                this.value = val.split('--').map( (item) => {
                    return this.transformDate( item.trim() );
                });
            }
            else{
                this.value = this.transformDate( val.trim() );
            }
 
            const execData = this.PLUGIN_DATA[this.equal];
            controller[this.OPERATOR](this.localdate, this.value, execData, this.mode);
    }
    get localdate (){
        return this.transformDate();
    }
    set localdate (val){
        this.#wordDate = val
    }
    transformDate (date){
        let _date = new Date(this.#wordDate);
        return Math.ceil( _date.getTime() / 100000 );
    }

}

export default Time;
