class Controller {
    token = null;
    #value = null;
    load(token) {
        this.token = token;
        const data = localStorage.getItem(this.token);
        if (data) {
            vnjs.state.data = JSON.parse(data);
        } else {
            vnjs.state.data = {};
        }
    }
    save(data) {
        localStorage.setItem(this.token, JSON.stringify(data));
    }
    /**
     * localStorage.remove()
     */
    clear(args) {
        if (args === true) {
            localStorage.removeItem(this.token);
            vnjs.state.data = {
                score: vnjs.state.data.score,
                player: vnjs.state.data.player,
            };
        } else if (Array.isArray(args)) {
            args.forEach((item) => {
                delete vnjs.state.data[item];
            });
            this.save(vnjs.state.data);
        }
    }
    set(data) {
        this.#value = null;
        for (let key in data) {
            let value = String(data[key]);
            this.#value = value;
            const _valueVar = value.match(/{{.+?}}/g);

            if (value.includes("+=")) {
                const val = value.replace("+=", "");
                this.valueIncrement(key, val);
            } else if (value.includes("-=")) {
                const val = value.replace("-=", "");
                this.valueDecrement(key, val);
            } else {
                if (isNaN(value)) {
                    vnjs.state.data[key] = value;
                } else {
                    vnjs.state.data[key] = Number(value);
                }
            }
            /**
             * LINK
             * varname: {{age}}
             * varname: Hello {{name}}
             */

            if (_valueVar) {
                _valueVar.forEach((_varData) => {
                    const _key2 = _varData.replace("{{", "").replace("}}", "");
                    let _value2 = vnjs.state.data[_key2];
                    if (!isNaN(_value2)) {
                        _value2 = Number(_value2);
                    }
                    this.#value = this.#value.replaceAll(_varData, _value2);
                    vnjs.state.data[key] = this.#value;
                });
            }
        }
        this.save(vnjs.state.data);
    }
    valueIncrement(key, val) {
        let _val = Number(val);
        if (isNaN(_val)) {
            _val = val;
        }
        if (vnjs.state.data[key]) {
            vnjs.state.data[key] = vnjs.state.data[key] + _val;
        } else {
            vnjs.state.data[key] = _val;
        }
    }
    valueDecrement(key, val) {
        let _val = Number(val);
        if (isNaN(_val)) {
            _val = val;
            if (vnjs.state.data[key]) {
                vnjs.state.data[key] = vnjs.state.data[key].replace(_val, "");
            } else {
                vnjs.state.data[key] = "";
            }
            return;
        }
        if (vnjs.state.data[key]) {
            vnjs.state.data[key] = vnjs.state.data[key] - _val;
        } else {
            vnjs.state.data[key] = -_val;
        }
    }
    stringToData(reply) {
        let _newReply = String(reply);
        const variables = String(reply).match(/{{.+?}}/g);
        if (!variables) return _newReply;
        variables.forEach((varItem) => {
            const dataKey = varItem.replaceAll("{{", "").replaceAll("}}", "").trim();

            if(vnjs.state.data[dataKey]===undefined||vnjs.state.data[dataKey]===false||vnjs.state.data[dataKey]===null){
                _newReply = _newReply.replaceAll(varItem, "");
            }
            else{
                _newReply = _newReply.replaceAll(varItem, vnjs.state.data[dataKey]);
            }

        });
        return _newReply;
    }
}

export default new Controller();
