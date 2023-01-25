import { ZeroP2P } from "@zerodao/p2p";
import { ethers } from "ethers";
import PeerId from "peer-id";
import os from "node:os";
import fs from "node:fs";

export class Peer extends ZeroP2P {

	static async peerIdFromNodeKey(nodeKey) {
		return await PeerId.createFromPrivKey(nodeKey);
	}

	static async fromNetworkConfigFile(path: string) {
		var json = fs.readFileSync(path, 'utf8');

		let config = JSON.parse(json);

		if (config["node_key"] === undefined || config["multiaddr"] === undefined) throw new Error("cannot initialize without node_key");

		var signer = config["wallet_key"] ? new ethers.Wallet(config["wallet_key"]) : ethers.Wallet.createRandom();

		return new this({
			peerId: await this.peerIdFromNodeKey(config["node_key"]),
			multiaddr: config["multiaddrs"],
			signer
		});
	}

	static async generateNodeKey() {
		let peerId = await PeerId.create()
		let json = peerId.toJSON()	
		console.log(json)
	}

	static createEmptySigner() {
		return ethers.Wallet.createRandom();
	}

	static async toConfigFile() {
		return
	}

	constructor(options){
		super(options);
	}
					
}


(async () => {
	await Peer.createNodeKey();
})()


