import EventEmitter from "events";

abstract class Engine extends EventEmitter {
	state: string;	

	constructor({ 
		initTemeoutPropose,
		initTimeoutPrevote,
		initTemeoutPrecommit,
	}: EngineParams = {}) {
		super
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
