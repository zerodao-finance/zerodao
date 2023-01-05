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
import lp from "it-length-prefixed";
import pipe from "it-pipe";



export class Node {	
	// config
	config: types.Config;
	genesisDoc: types.GenesisDoc; // initial validator set
	privValidator: types.PrivValidator; // nodes private validator key

	//network
	nodeKey: p2p.NodeKey
	
	//services
	consensusReactor // for participating in consensus
	blockStore // store the blockchain to disk
	eventBus // pub/sub for services
	stateStore
	bcReactor // for block-syncing

	static init(
		config: types.Config,
		privValidator: types.PrivValidator,
		nodeKey: p2p.NodeKey,
		genesisDocProvider: genesisDocProvider
		logger: log.Logger,
		...options
	) {
		
	}
	constructor() {

	}
}
