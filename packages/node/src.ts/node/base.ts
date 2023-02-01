import lp from "it-length-prefixed";
import pipe from "it-pipe";
import yargs from "yargs";
import { ethers } from "ethers";
import { logger } from "../logger";
import { MempoolConstructor } from "../mempool";
import { RPC } from "../rpc";
import { Peer } from "../p2p";
import { EventEmitter } from "events";

class Node extends EventEmitter {
	mempool; 
	mempoolReactor;
	peer: Peer;
	rpc: RPC;
	proxyApp: any = {
		checkTxSync: function (tx) {
			return [{ Code: 1, value: "something" }, null];
		}
	}

	// initialize new node from an instance of a libp2p peer
	// @params { peer: Peer } takes a libp2p instance
	// @returns { node: Node } returns new instance of this class
	static initNode({ peer }: any = {}) {
		// get env variables and start a new peer
		logger.info("initializing node with configs...");
		return new this({ 
			rpc: RPC.init(), 
			peer: peer 
		});
	}
	
	constructor({ peer, rpc }) {
		super();
		this.peer = peer;
		this.rpc = rpc;
	}

	// initializes mempool and mempool reactor
	// connects reactor to the rpc via .addService() method
	initializeMempoolAndReactor(config) {
		// 0, should be replaced by this.state.height
		const [ mp, reactor ] = MempoolConstructor(
			0,
			this.proxyApp,
			config,
			this.peer
		);

		this.mempool = mp;
		this.mempoolReactor = reactor;
		this.rpc.addService(this.mempoolReactor);
		logger.info("mempool & reactor configured...");
	}

	async startNode(port) {
		// start mempool and connect mempool service to rpc
		await new Promise((resolve) => {
			this.initializeMempoolAndReactor({ MAX_BYTES: 10000 });
			setTimeout(resolve, 2000);
			logger.info("initialize mempool & mempool reactor");
		});

		// start libp2p
		await new Promise((resolve) => {
			this.peer.start();
			this.rpc.start({address: '0.0.0.0', port: port})
			setTimeout(resolve, 2000);
			logger.info(`started rpc listening on 0.0.0.0:${port}`);
			logger.info("started libp2p module...");
		});

		await new Promise(async (resolve) => {
			await this.mempoolReactor.initTxGossip()
			setTimeout(resolve, 2000);
			logger.info("gossiping incoming transactions started...");
		})

	}
	
}

(async () => {
	let peer = await Peer.fromMultiaddr('mainnet', 'first');
	let peer2 = await Peer.fromMultiaddr('mainnet', 'second');
	const callbackPromise = async (msg) => {
		logger.info(`heard message, ${msg}`);
	};

	
	await new Promise(async (resolve) => {
		let node_1 = Node.initNode({ peer: await Peer.fromMultiaddr("mainnet", "first") });
		let node_2 = Node.initNode({ peer: await Peer.fromMultiaddr("mainnet", "second") });

		await node_2.startNode('50052');
		await node_1.startNode('50051');	

		setTimeout(resolve, 2000);
	});

	logger.info("ready to go...")


})()
