
const controller = {
    '===': (wordtime, value, execData, mode) => {
        if(mode==="worddate"){
            let worddate = new Date(wordtime * 100000).toLocaleDateString();
            let val = new Date(value * 100000).toLocaleDateString();
            if(worddate === val){
                vnjs.exec(execData)
            }
            return;
        }
        if(wordtime===value){
            vnjs.exec(execData)
        }
    },
    '>': (wordtime, value, execData) => {
        if(wordtime>value){
            vnjs.exec(execData)
        }
    },
    '<': (wordtime, value, execData) => {
        if(wordtime<value){
            vnjs.exec(execData)
        }
    },
    '!==': (wordtime, value, execData, mode) => {
        if(mode==="worddate"){
            let worddate = new Date(wordtime * 100000).toLocaleDateString();
            let val = new Date(value * 100000).toLocaleDateString();
            if(worddate !== val){
                vnjs.exec(execData)
            }
            return;
        }

        if(wordtime!==value){
            vnjs.exec(execData)
        }
    },
    '<=': (wordtime, value, execData, mode) => {
        
        if(mode === "worddate"){
            let worddate = new Date(wordtime * 100000).toLocaleDateString();
            let val = new Date(value * 100000).toLocaleDateString();
            if(worddate === val){
                vnjs.exec(execData);
            }
            else if(wordtime < value){
                vnjs.exec(execData);
            }
            return;
        }

        if(wordtime<=value){
            vnjs.exec(execData)
        }
    },
    '>=': (wordtime, value, execData, mode) => {
        if(mode === "worddate"){
            let worddate = new Date(wordtime * 100000).toLocaleDateString();
            let val = new Date(value * 100000).toLocaleDateString();
            if(worddate === val){
                vnjs.exec(execData)
            }
            else if(wordtime > value){
                vnjs.exec(execData)
            }
            return;
        }
        if(wordtime>=value){
            vnjs.exec(execData)
        }
    },
    '[]': (wordtime, value, execData) => {
        if( value[0] <= wordtime && wordtime <= value[1]){
            vnjs.exec(execData)
        }
    },
    '][': (wordtime, value, execData) => {
        if(wordtime < value[0] || wordtime > value[1]){
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

          
            const [ key, val ] = this.equal.split(this.OPERATOR);
            if(this.mode==='worddate'){
                this.dateEval(val)
            }
            if(this.mode==='wordtime'){
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
            controller[this.OPERATOR](this.wordtime, this.value, execData)
    }
    get wordtime (){
     
        const [ hh, mm ] = this.#wordTime.split("-");
        return  Number(hh+mm);
    }
    set wordtime (val){
        this.#wordTime = val;
    }
    dateEval (val){
             /**
             * Определяем диапазон ли лежит в значении
             */
            if(val.includes('--')){
                    this.value = val.split('--').map( (item) => {
                        return this.transformDate( item.trim() )
                    });
            }
            else{
                this.value = this.transformDate( val.trim() );
            }

            const execData = this.PLUGIN_DATA[this.equal];
            controller[this.OPERATOR](this.worddate, this.value, execData, this.mode);
    }
    get worddate (){
        const [ yyyy, mm, dd ] = this.#wordDate.split("-");
        return  Number(yyyy+ mm+ dd);
        //const d = this.#wordDate.split()
        //return // this.transformDate();
    }
    set worddate (val){
        this.#wordDate = val
    }
    transformDate (date){
        const [ yyyy, mm, dd ] = date.split("-");
        return  Number(yyyy+ mm+ dd);
    }

}

export default Time;
