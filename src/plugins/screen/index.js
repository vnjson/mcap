export default function () {
    vnjs.store.screen = $("#screen");
    vnjs.once('postload', () => {
        const { scale } = vnjs.package;
        if(!scale||scale===1) return;
        document.querySelector('.wrapper').style.transform = `scale(${scale})`;

    })
}
