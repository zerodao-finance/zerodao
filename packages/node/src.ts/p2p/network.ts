import { ZeroP2P } from "@zerodao/p2p";
import { ethers } from "ethers";
import { logger } from "../logger";
import PeerId from "peer-id";
import os from "node:os";
import fs from "node:fs";
import _ from "lodash";

export class Peer extends ZeroP2P {

	peerId: any;
	wallet_key: any;

	static async peerIdFromNodeKey(nodeKey) {
		return await PeerId.createFromJSON(nodeKey);
	}

	static async fromConfig(path: string = 'default.config.json') {
		var json = fs.readFileSync(path, 'utf8');

		let config = JSON.parse(json);
		var signer = new ethers.Wallet(config.wallet.private_key);	
		logger.info(`successfully loaded node: ${config['node_id']} `)

		return new this({
			nodeId: config["node_id"],
			peerId: await this.peerIdFromNodeKey(config["peer_id"]),
			multiaddr: config["multiaddrs"],
			signer
		});
	}

	static async createKey() {
		return await PeerId.create()
	}

	

	static createSigner() {
		return ethers.Wallet.createRandom();
	}

	static async fromMultiaddr(multiaddr: string, profile: string = 'defualt') {
		let nodeKey = await Peer.createKey();
		let signer = Peer.createSigner();
		
		return new this({
			nodeId: profile,
			peerId: nodeKey,
			signer: signer,
			multiaddr: multiaddr
		});
	}

	constructor(options){
		super(options);
		this.saveConfig(options);
	}

	async createPubsubProtocol(topic, callback) {
		await (this.pubsub.subscribe as any)(topic, callback);

		return (function (topic, msg) {
			(this.pubsub.publish as any)(topic, msg);
		}).bind(this);

	} 

	saveConfig(options) {
		let config = {
			node_id: options.nodeId,
			peer_id: options.peerId.toJSON(),
			wallet: {
				private_key: options.signer.privateKey,
				public_key: options.signer.publicKey
			}
		}
		let json = JSON.stringify(config);

		fs.writeFile(`${options.nodeId}.config.json`, json, 'utf8', () => {logger.info("current node config saved...")})
	}
}




