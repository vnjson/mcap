/* native [jump] [next] [timeout] */
/* debug */
import debug from "./plugins/debug/index.js";
import debugUtils from "./plugins/debug-utils/index.js";
/* basic */
import assetsLoader from "./plugins/assets-loader/index.js";
import screen from "./plugins/screen/index.js";
import fontFamily from "./plugins/font-family/index.js";
import data from "./plugins/data/index.js";
import dialogBox from "./plugins/dialog-box/index.js";
import hands from "./plugins/hands/index.js";
import audio from "./plugins/audio/index.js";
import menu from "./plugins/menu/index.js";
import mainMenu from "./plugins/main-menu/index.js";
import term from "./plugins/term/index.js";
import show from "./plugins/show/index.js";
import showAuto from "./plugins/show-auto/index.js";
import scene from "./plugins/scene/index.js";
import table from "./plugins/table/index.js";
import clear from "./plugins/clear/index.js";
import switchVnjson from "./plugins/switch/index.js";
import qa from "./plugins/qa/index.js";
import chess from "./plugins/chess/index.js";
import input from "./plugins/input/index.js";
import wiki from "./plugins/wiki/index.js";
import crossWord from "./plugins/crossword/index.js";
import test from "./plugins/test/index.js";
import slide from "./plugins/slide/index.js";
import content from "./plugins/content/index.js";
import voice from "./plugins/voice/index.js";
import html from "./plugins/html/index.js";
import discordLog from "./plugins/discord-log/index.js";
import statusBar from "./plugins/status-bar/index.js";
// minecraft
import mcPlayer from "./plugins/mc-player/index.js";
import mcExec from "./plugins/mc-exec/index.js";
import mcGet from "./plugins/mc-get/index.js";
import mcCheck from "./plugins/mc-check/index.js";
//
import paintBoard from "./plugins/paint-board/index.js";
import clipBoard from "./plugins/clipboard/index.js";
import video from "./plugins/video/index.js";

import typewrite from "./plugins/typewrite/index.js";
import area from "./plugins/area/index.js";
import selectWord from "./plugins/select-word/index.js";
import dragItems from "./plugins/drag-items/index.js";
import consoleVnjson from "./plugins/console/index.js";
import blocks from "./plugins/blocks/index.js";
import staticApp from "./plugins/static-app/index.js";
import HUD from "./plugins/hud/index.js";

import dialogBoxInfo from "./plugins/dialog-box-info/index.js";
import executeVnjson from "./plugins/execute/index.js";
//import filter from "./plugins/filter/index.js";
import spriteAnimate from './plugins/sprite-animate/index.js';
import statusBarPush from './plugins/status-bar-push/index.js';
import evalVnjson from './plugins/eval/index.js';
import getLocalTime from './plugins/get-localtime/index.js';
import intervalVnjson from './plugins/interval/index.js';
import getData from './plugins/get-data/index.js';
import craftOS from './plugins/craft-os/index.js';
import mcCCT from './plugins/mc-cct/index.js';
/**
 * Init plugins
 */

vnjs.use(assetsLoader);
vnjs.use(screen);
vnjs.use(fontFamily);
/*components*/
vnjs.use(scene);
vnjs.use(show);
vnjs.use(showAuto);
vnjs.use(audio);
vnjs.use(menu);
vnjs.use(mainMenu);
vnjs.use(term);
vnjs.use(table);
vnjs.use(clear);
vnjs.use(dialogBox);
vnjs.use(hands);
vnjs.use(data);
vnjs.use(switchVnjson);
vnjs.use(qa);
vnjs.use(chess);
vnjs.use(input);
vnjs.use(wiki);
vnjs.use(crossWord);
vnjs.use(test);
vnjs.use(slide);
vnjs.use(content);
vnjs.use(voice);
vnjs.use(html);
vnjs.use(discordLog);
vnjs.use(statusBar);
// minecraft
vnjs.use(mcPlayer);
vnjs.use(mcCheck);
vnjs.use(mcExec);
vnjs.use(mcGet);
//
vnjs.use(paintBoard);
vnjs.use(clipBoard);
vnjs.use(video);
vnjs.use(typewrite);
vnjs.use(area);
vnjs.use(selectWord);
vnjs.use(dragItems);
vnjs.use(consoleVnjson);
vnjs.use(blocks);
vnjs.use(staticApp);
vnjs.use(HUD);
vnjs.use(dialogBoxInfo);
vnjs.use(executeVnjson);
//vnjs.use(filter);
vnjs.use(spriteAnimate);
vnjs.use(statusBarPush);
vnjs.use(evalVnjson);
vnjs.use(getLocalTime);
vnjs.use(intervalVnjson);
vnjs.use(getData);
vnjs.use(craftOS);
vnjs.use(mcCCT);
/**
 * LOAD scenes
 */
function showError (err){
    const $errorWindow =  $(".debug-error");
    $errorWindow.show();
    const $errorMessageContainer = $errorWindow.find(".debug-error__msg")
    const yamlError = vnjs._loadError();
    if(yamlError){
        $errorMessageContainer.html(yamlError.msg);
        $errorWindow.find('.debug-error__path').html(yamlError.path)
        $errorWindow.find('.debug-error__pos').html(yamlError.pos)
        $errorWindow.find('.debug-error__code').html(yamlError.snippet)
    }
    else{   
        $errorMessageContainer.html("Невалидный скрипт " +  err.message);
    }
}
fetch(`scenes/vn.json?v=${new Date().getTime()}`)
    .then((r) => r.json())
    .then((tree) => {
        vnjs.mount(tree)
        if (tree.$root.package.debug) {
          vnjs.use(debug);
          vnjs.use(debugUtils);
        }
    })
    .catch((err) => {
        showError(err);
        console.error("Invalid script", err.message);
    });

vnjs.on("postload", function () {
    vnjs.config = {
        debug: vnjs.package.debug,
        width: 1024,
        height: 768,
    };
    // ?jump=scene.label
    // ?jump=scene  //default $init
    const label = new URL(location.href).searchParams.get("jump");
    if (label) {
        const [sceneName, labelName] = label.split(".");

        vnjs.exec({ jump: `${sceneName}.${labelName}` });
    } else {
        vnjs.exec({ jump: "$root.$init" });
    }
});
