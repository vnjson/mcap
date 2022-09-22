import controller from "./controller.js";

class Switch {
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
    constructor() {}
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

            const [key, val] = this.equal.split(this.OPERATOR);

            this.dataValue = vnjs.state.data[key.trim()];
            if (isNaN(+val)) {
                this.value = val.trim();
                // false
                if (this.value === "false") {
                    this.value = undefined;
                }
                if (this.value === "undefined") {
                    this.value = undefined;
                }
                if (this.value === "null") {
                    this.value = undefined;
                }
            } else {
                this.value = Number(val);
            }
            const execData = this.PLUGIN_DATA[this.equal];
            if(typeof this.dataValue==='string'){
                this.value = String(this.value)
            }
            controller[this.OPERATOR](this.dataValue, this.value, execData);
        }
    }
}

export default Switch;
