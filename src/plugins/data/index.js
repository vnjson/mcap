export default {
    token: null,
    mount (){
        /**
         * events
         */
        vnjs.on("postload", () => {
            this.load( vnjs.package.publish.token )
        });

        vnjs.on("data-set", (params) => this.set(params));
        vnjs.on("data-clear", () => this.clear());

        /**
         * deprecated
         */
        vnjs.on("set-data", (params) => {
            console.warn("[set-data] is deprecated. Use [data-set]");
            this.set(params)
        });
        vnjs.on("clear-data", () => {
            console.warn("[clear-data] is deprecated. Use [data-clear]");
            this.clear()
        });
    },
    load(token) {
        this.token = token;
        const data = localStorage.getItem(this.token)
        if(data){
            vnjs.state.data = JSON.parse(data);
        }
        else{
            vnjs.state.data = {};
        }
    },
    save(data) {
        localStorage.setItem(this.token, JSON.stringify(data))
    },
    /**
     * localStorage.remove()
     */
    clear() {
        localStorage.removeItem(this.token);
        vnjs.state.data = {
            score: vnjs.state.data.score,
            player: vnjs.state.data.player,
        };
    },
    set(data) {
        for (let key in data) {
            const value = String(data[key]);
            if (value.includes("+=")) {
                const val = value.replace("+=", "");
                this.valueIncrement(key, val)
            } else if(value.includes("-=")){
                const val = value.replace("-=", "");
                this.valueDecrement(key, val)
            } else {
                if(isNaN(value)){
                    vnjs.state.data[key] = value;
                } else{
                    vnjs.state.data[key] = Number(value);
                }
            }
        }
        this.save(vnjs.state.data);
    },
    valueIncrement(key, val) {
        let _val = Number(val);
        if (isNaN(_val)) {
          _val = val
        }
        if (vnjs.state.data[key]) {
            vnjs.state.data[key] = vnjs.state.data[key] + _val;
        } else {
            vnjs.state.data[key] = _val;
        }
    },
    valueDecrement(key, val) {
        let _val = Number(val);
        if (isNaN(_val)) {
          _val = val
          if (vnjs.state.data[key]) {
            vnjs.state.data[key] = vnjs.state.data[key].replace(_val, '');
          }
          else{
            vnjs.state.data[key] = ''
          } 
          return
        }
        if (vnjs.state.data[key]) {
            vnjs.state.data[key] = vnjs.state.data[key] - _val;
        } else {
            vnjs.state.data[key] = - _val;
        }
    }

}

