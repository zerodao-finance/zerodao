"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
class Engine extends events_1.default {
    constructor({ initTemeoutPropose, initTimeoutPrevote, initTemeoutPrecommit, } = {}) {
        super
            .
        ;
    }
    /*
     * on(eventName, callback) {
     * 	super.on(state, (...msg) => this.eventMiddleware(callback, state, ..msg));
     * 	}
     */
    emit(state, ...msg) {
        logger.info(`EMIT: <${state}, ${msg}>`);
        super.emit(state, this.signatory, ...msg);
    }
    stateRound(round) {
        this.round = round;
        this.step = PROPOSE;
    }
}
//# sourceMappingURL=engine.js.map