import { ZeroP2P } from "@zerodao/p2p";
import { CID } from "multiformats/cid";

export class ZeroNetworkPeer extends ZeroP2P {

	
	
	constructor() {
		super(); 
	}

	_provideCID(cid: CID) {

	}
}
