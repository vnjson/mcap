import mcGet from "./controllers/mc-get.js";
import * as blockController from "./block-controller";
import mcGetCardItem from "./controllers/mc-get-card-item.js";
import mcGetCardSlot from "./controllers/mc-get-card-slot.js";
import mcGetCardInfo from './controllers/mc-get-card-info.js';
import mcGetChat from './controllers/mc-get-chat.js';
import mcGetWeather from './controllers/mc-get-weather.js';
import mcGetDate from './controllers/mc-get-date.js';
import mcGetTime from './controllers/mc-get-time.js';
import mcGetPrintPos from './controllers/mc-get-print-pos.js';
import mcGetPrintLabel from './controllers/mc-get-print-label.js';
import mcGetBiome from './controllers/mc-get-biome.js';
import webModem from './controllers/web-modem.js';
import mcGetEntity from "./controllers/mc-get-entity.js";

export default function () {}
/**
 * получаем блок
 */
vnjs.on("mc-get", mcGet);
/**
 * сравнение по ID
 */
vnjs.on("mc-get-block", blockController.mcGetBlockCommon);

/**
 * nbt
 */
vnjs.on("mc-get-block-nbt", blockController.mcGetBlockNBT);

/**
 * get chest
 */

vnjs.on("mc-get-store-slot", blockController.mcGetStoreSlot);

/**
 * get chest total items
 */
vnjs.on("mc-get-store-total", blockController.mcGetStoreTotal);

/**
 * табличка
 */
 vnjs.on("mc-get-sign", blockController.mcGetSign);

/**
 * Рамка
 */

vnjs.on('mc-get-frame-item', blockController.mcGetFrameItem);

/**
 * Предметы в руках
 */
vnjs.on('mc-get-hand-item', blockController.mcGetHandItem);

/**
 * book
 */
vnjs.on('mc-get-book', blockController.mcGetBook);
vnjs.on('mc-get-book-page', blockController.mcGetBookPage);

/**
 * player
 */
vnjs.on('mc-get-player-nbt', blockController.mcGetPlayerNBT);

/**
 * card
 */
vnjs.on('mc-get-card-item', mcGetCardItem);
vnjs.on('mc-get-card', mcGetCardSlot);
vnjs.on('mc-get-card-info', mcGetCardInfo); // доступ из новеллы к карточкам описаным в файле $root/mtcs.yaml
/**
 * WORLD
 */
vnjs.on('mc-get-chat', mcGetChat);
vnjs.on('mc-get-weather', mcGetWeather);
vnjs.on('mc-get-biome', mcGetBiome);
vnjs.on('mc-get-date', mcGetDate);
vnjs.on('mc-get-time', mcGetTime);
/**
 * Printer
 */
vnjs.on('mc-get-print-pos', mcGetPrintPos);
vnjs.on('mc-get-print-label', mcGetPrintLabel);
/**
 * modem
 */
vnjs.on('web-modem', webModem);
/**
 * entity
 */
vnjs.on('mc-get-entity', mcGetEntity);