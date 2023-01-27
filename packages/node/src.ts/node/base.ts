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

	async startNode() {
		// start mempool and connect mempool service to rpc
		await new Promise((resolve) => {
			this.initializeMempoolAndReactor({ MAX_BYTES: 10000 });
			setTimeout(resolve, 2000);
			logger.info("initialize mempool & mempool reactor");
		});
		// start libp2p
		await new Promise((resolve) => {
			this.peer.start();
			this.rpc.start({address: '0.0.0.0', port: 50051})
			setTimeout(resolve, 2000);
			logger.info("started rpc listening on 0.0.0.0:50051");
			logger.info("started libp2p module...");
		});

	}
	
}

(async () => {
	let peer = await Peer.fromMultiaddr('mainnet');
	let peer2 = await Peer.fromMultiaddr('mainnet', 'second');
	await new Promise((resolve) => {
		peer.start();
		peer2.start();
		setTimeout(resolve, 2000);
	});

	let rsp: any[] = await new Promise(async (resolve) =>	{
			let peer_publish = await peer.createPubsubProtocol('test', async (msg) => console.log("heard msg on peer"));
			let peer2_publish = await peer.createPubsubProtocol('test', async (msg) => console.log("heard msg on peer2"));

			await setTimeout(() => {
				resolve([peer_publish, peer2_publish])
			}, 5000);

	});

	let [ p1, p2 ] = rsp;
	p1('test', ethers.utils.randomBytes(8)) 
  p2('test', ethers.utils.randomBytes(8)) 

	// TODO: fix this test still not calling callback on topic subscription


  // let node = Node.initNode({ peer });
	// await node.startNode();

	
})()
