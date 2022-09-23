import "./style.css";
const $tpl = $(
    '<iframe class="craft-os__vnjson component" src="data/cctweb.html" width="645" height="375"></iframe>'
);


export default function () {
    vnjs.store.screen.append($tpl);
    vnjs.on("vnjson.mount", () => {
        if (vnjs.package['craft-os']) {
            init();
        }
    });


}

function init () {
    let win = document.querySelector(
        "iframe.craft-os__vnjson"
    ).contentWindow;
    win.postMessage(
        vnjs.package['craft-os'],
        location.origin + "/data/cctweb.html"
    );
    
};

vnjs.on("craft-os", (args) => {
    if (args) {
        $tpl.show();

    } else {
        $tpl.hide();
    }
});