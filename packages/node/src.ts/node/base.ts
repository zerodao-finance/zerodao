import lp from "it-length-prefixed";
import pipe from "it-pipe";
import yargs from "yargs";
import { MempoolConstructor } from "../mempool";
import { RPC } from "../rpc";


class NodeBaseClass {

	mempool; 
	mempoolReactor;

	
	constructor() {

	}

	initializeRPC ( ) {

	}

	initializeMempoolAndReactor () {
		const [ mp, reactor ] = MempoolConstructor(
			this.state.Height,
			this.appProxy,
			config
		);

		this.mempool = mp;
		this.mempoolReactor = reactor;
	}


}
