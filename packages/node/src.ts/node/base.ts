import { ethers } from "ethers";
import { bls } from "@noble/bls12-381";
import { ZeroP2P } from "@zerodao/p2p";
import { logger } from "../logger";
import { Validator, type ValidatorSet} from "./Validator";
import {
	NODE_TYPE,
	NODE_STATUS,
	CONSENSUS_ENGINE
} from "./types";
import lp from "it-length-prefixed";
import pipe from "it-pipe";



export class Node {	
	public _engineType: CONSENSUS_ENGINE;
	public _memory;
	
	protected _validator: ValidatorSet; 
	protected _type: NODE_TYPE = NODE_TYPE.null; 
	protected _status: NODE_STATUS = NODE_STATUS.NOT_READY;
	protected _blsKey?: unknown;	
	protected _state: NODE_STATE;

	protected _canValidate: boolean = false;	
	
	static VALIDATOR({ blsKey }): Node {
		return new Node({ 
			_type: NODE_TYPE.VALIDATOR,
			_blsKey: blsKey
			_pubKey: bls.getPublicKey(blsKey),
			_canValidate: true
		});
	}

	static FULL(): Node {
		return new Node({
			_type: NODE_TYPE.FULL
		});
	}

	constructor( config: Partial<NodeConfig>) {
		Object.assign(this, ...config);
	}	

	async run() {
		if (this._status != NODE_STATUS.READY) await this.sync();	

	}
	
	async sync(retryLimit?: number) {
		logger.info(`syncing --retry ${retryLimit}`);
		this._status = NODE_STATUS.SYNCING;
		this._status = await new Promise((resolve, reject) => {
			try {
				let _peer = //select random peer from this._peer
				let { stream } = await this.p2p.dialProtocol(
					peer,
					(this as any).constructor.PROTOCOL.BOOTSTRAP + `/${peer}`
				);
				
				// request sync and send status to dialed peer
				await pipe(
					(new TextEncoder()).encode(`REQUEST:SYNC:STATUS:SYNCING:ID:${peer}`),
					lp.encode(),
					stream.sink
				);

				await this.p2p.handle((this as any).constructor.PROTOCOL.BOOTSTRAP + `/${this.p2p /** own peer id */}`, ({stream}) => {
					// handle incoming syncing information from dialed peer
				})

				// sync logic
				await setTimeout(() => {
					logger.info("node sync completed");
					resolve(NODE_STATUS.READY);
				}, 1000);
			} catch (error) {
				if (retryLimit > 0) this.sync(retryLimit - 1);
				reject(NODE_STATUS.ERROR);
			}
		})
	}
	
	async subscribePeers() {
		await (this.p2p.pubsub as any).subscribe("lzero.peers.all", async(message: any) => {
			const { data, frrom } = message;
			const { address } = fromBufferToJSON(data);
			if (!this._peers.includes(from)) {
				this._peers.push(from);
			}
		});
	}

	async unsubscribePeer() {
		await this.p2p.pubsub.unsubscrive("lzero.peers.all");
		this._peers = [];
	}
	
}
