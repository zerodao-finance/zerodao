import { ZeroP2P } from "@zerodao/p2p";
import { ethers } from "ethers";
import { logger } from "../logger";
import PeerId from "peer-id";
import os from "node:os";
import fs from "node:fs";
import _ from "lodash";
import chalk from "chalk";

export class Peer extends ZeroP2P {

	peerId: any;
	wallet_key: any;
	savePath: string = `${os.homedir()}/.zeronode/config/profiles/`

	
	static async fromConfig(path: string = 'default.config.json') {
		var json = fs.readFileSync(path, 'utf8');

		let config = JSON.parse(json);

		logger.info(`loading ${chalk.yellow("PEER")} from config file ${ chalk.yellow(`${ config['node_id'] }` ) } \n `);
		var signer = new ethers.Wallet(config.wallet.private_key);	

		return new this({
			nodeId: config["node_id"],
			peerId: await this.peerIdFromNodeKey(config["peer_id"]),
			multiaddr: config["multiaddrs"],
			signer
		});
	}

	static async fromMultiaddr(multiaddr: string, profile: string = 'default') {
		let nodeKey = await Peer.createKey();
		let signer = Peer.createSigner();

		logger.info(`creating ${chalk.yellow("PEER")} with node key ${chalk.yellow(`${ nodeKey }`)} \n`);
		
		return new this({
			nodeId: profile,
			peerId: nodeKey,
			signer: signer,
			multiaddr: multiaddr
		});
	}

	static async peerIdFromNodeKey(nodeKey) {
		return await PeerId.createFromJSON(nodeKey);
	}

	static createSigner() {
		return ethers.Wallet.createRandom();
	}

	static async createKey() {
		return await PeerId.create()
	}

	static createConfigDir() {
		if (fs.existsSync(`${os.homedir()}/.zeronode/config/profiles`)) return
		fs.mkdirSync(`${os.homedir()}/.zeronode/config/profiles/`, { recursive: true });
	}

	// constructor ===============>
	constructor(options){
		super(options);
		Peer.createConfigDir();
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

		fs.writeFile(`${this.savePath}${options.nodeId}.config.json`, json, 'utf8', () => {logger.info(`${chalk.magenta(`${chalk.green("Libp2p Startup") }|=> node config saved...`)}`)})
	}

}






