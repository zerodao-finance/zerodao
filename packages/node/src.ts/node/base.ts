/*
 * Node is the highest level interface to a full Zero Network node
 * it includes all configurations and running services
 */
import * as types from "../types";
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
import { RPC } from "../rpc";
import lp from "it-length-prefixed";
import pipe from "it-pipe";
import yargs from "yargs";



/*
 * @param (stateSync: boolean) whether a node should stateSync on startup (defaults: false);
 */
export class Node {	
	static init() {
		let rpc = RPC.init();
		return new Node({ rpc: rpc });
	}

	constructor({
		rpc,
	}) {

		this.rpc = rpc;
	}
}

const addService = ({
	//TODO: refactor for ease of development
	// adding services
	zero_sendTransaction: this.wrapServiceMethod("zero_sendTransaction", (call, callback) => {
		callback(null, (message) => {
			return { status: "SUCCESS" }; 
		})
	}),
	
	zero_getBalance: this.wrapServiceMethod("zero_getBalance", (call, callback) => {
		callback(null, (message) => {
			return { status: "SUCCESS" };
		})
	}),

	zero_stakeTransaction: this.wrapServiceMethod("zero_stakeTransaction",  (call, callback) => {
		callback(null, (message) => {
			return { status: "SUCCESS" };
		})
	}),

	zero_releaseTranasction: this.wrapServiceMethod("zero_releaseTransaction", (call, callback) => {
		callback(null, (message) => {
			return { status: "SUCCESS" };
		})
	})

});


