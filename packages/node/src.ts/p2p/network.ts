import { ZeroP2P } from "@zerodao/p2p";

export class ZeroNetwork extends ZeroP2P {

	static get PROTOCOLS() {
		return [
			"node:v.1:mempool",
			"node:v.1:block-sync",
			"node:v.1:pex",
			"node:v.1:consensus"
		]
	}

	constructor(){
		super()
	}
	
	publish(peer:string, message: Message) {
		await this.dialProtocol(
			peer,
			message.protocol
		);
	}

}
