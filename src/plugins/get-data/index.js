import { uuidv4, getRandom, formatURL } from './utils.js';


export default function (){}

vnjs.on('get-uuid', (varName) => {
    vnjs.state.data[varName] = uuidv4();
});

vnjs.on('get-rnd', (args) => {
    const rnd = getRandom(args.min, args.max);
    if(args.list){

        vnjs.state.data[args.value] = args.list[rnd];
    }
    else{
        vnjs.state.data[args.value] = rnd;
    }

});

vnjs.on('get-data', (args) => {
    if(vnjs.package['url-db']){
        const id = vnjs.plugins.data.stringToData(args.id);
        const namespace = vnjs.plugins.data.stringToData(args.namespace);

        const query = `SELECT * FROM ${namespace} WHERE id = '${id}'`;
        const URL = formatURL(vnjs.package['url-db'], query);
        fetch(URL)
            .then(r=>r.json())
            .then( (data) => {
                vnjs.state.data[args.value] = data.items[0].value;
            })
            .catch(err => console.error(err));
    }
    else{
        vnjs.emit('vnjson:error', 'В файле $root/package.yaml должно быть свойство url_db');
    }
})

