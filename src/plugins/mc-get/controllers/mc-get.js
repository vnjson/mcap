export default function (args){
    let _pos = vnjs.plugins['data'].stringToData(args.pos) 
    const [x, y, z] = _pos.split(" ");
    const data = {
        request: args.request,
        slot: args.slot || 0,
        posX: x || 0,
        posY: y || 0,
        posZ: z || 0,
        data: "",
    };
    const str = `GET_${JSON.stringify(data)}`;

    query(str)
        .then((res) => {
            console.log(res);
            if(res.data!==""){
                res.data = JSON.parse(res.data);
            }
            vnjs.store.MINECRAFT = vnjs.store.MINECRAFT || {};
            vnjs.store.MINECRAFT.TYPE = args.request;
            vnjs.store.MINECRAFT[args.request] = res;
            if (args.callback) {
                args.callback(response);
            }
        })
        .catch((err) => {
            if (args.callback) {
                args.callback(err);
            }
        });
}


function query(request) {
    return new Promise((resolve, reject) => {
        try {
            window.mcefQuery({
                request,
                persistent: true,
                onSuccess: (response) => {
                    resolve(JSON.parse(response));
                },
                onFailure: (errCode, errMsg) => {
                    reject(JSON.parse(errMsg));
                },
            });
        } catch (err) {
            reject(JSON.parse(err));
        }
    });
}
