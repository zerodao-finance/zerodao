import lp from "it-length-prefixed";
import pipe from "it-pipe";
import yargs from "yargs";
import { ethers } from "ethers";
import { logger } from "../logger";
import { MempoolConstructor } from "../mempool";
import { RPC } from "../rpc";
import { Peer } from "../p2p";
import { EventEmitter } from "events";
import { StateTrie } from "../trie/trie";
import { TransactionEngine } from "../application/engine";
import chalk from "chalk";
import path from "path";
import fs from "node:fs";
import os from "node:os";
import {MempoolConfig} from "../mempool/types";

class Node extends EventEmitter {
	mempool;
	mempoolReactor;
	peer: Peer;
	rpc: RPC;
	trie: StateTrie
	proxyApp: TransactionEngine;

	configPath = `${os.homedir()}/.zeronode/config`;

	// initialize new node from an instance of a libp2p peer
	// @params { peer: Peer } takes a libp2p instance
	// @returns { node: Node } returns new instance of this class
	static initNode({ peer }: any = {}) {
		// get env variables and start a new peer
		logger.info(
      chalk.magenta(
        `${chalk.green("Node Startup")}|=> initializing node & configs...`
      )
    );
		return new this({
			rpc: RPC.init(),
			peer: peer
		});
	}

	constructor({ peer, rpc }) {
		super();
		this.peer = peer;
		this.rpc = rpc;
		if (!fs.existsSync(this.configPath)) fs.mkdirSync(this.configPath, { recursive: true });
		if (!fs.existsSync(path.join(this.configPath, 'db'))) fs.mkdirSync(path.join(this.configPath, 'db'));
		logger.info(chalk.magenta(`${ chalk.green("Node Startup") }|=> creating storage directories if needed...`));
		this.trie = new StateTrie();
	}

	initializeApplicationLayer() {
		this.proxyApp = new TransactionEngine(this.trie);
		logger.info(chalk.magenta(`${ chalk.green("Node Startup") }|=> app proxy initialized...`));
	}

	// initializes mempool and mempool reactor
	// connects reactor to the rpc via .addService() method
	initializeMempoolAndReactor(height: number, config: MempoolConfig) {
		// 0, should be replaced by this.state.height
		const [ mp, reactor ] = MempoolConstructor(
			height,
			this.proxyApp,
			config,
			this.peer
		);

		this.mempool = mp;
    this.mempoolReactor = reactor;
    this.rpc.addService(this.mempoolReactor);
		logger.info(chalk.magenta(`${ chalk.green("Node Startup") }|=> mempool & reactor created...`));
	}

	async startNode(height: number, port: string | number) {
    // start application layer
    this.initializeApplicationLayer();

    // start mempool and connect mempool service to rpc
    await new Promise((resolve) => {
      this.initializeMempoolAndReactor(height, { MAX_BYTES: 10000 });
      setTimeout(resolve, 2000);
      logger.info(
        chalk.magenta(
          `${chalk.green("Node Startup")}|=> mempool & reactor initialized`
        )
      );
    });

    // start libp2p
    await new Promise((resolve) => {
      this.peer.start();
      this.rpc.start({ address: "0.0.0.0", port: port });
      setTimeout(resolve, 2000);
      logger.info(
        chalk.magenta(
          `${chalk.green(
            "Node Startup"
          )}|=> started rpc listening on 0.0.0.0:${port}`
        )
      );
      logger.info(
        chalk.magenta(
          `${chalk.green("Node Startup")}|=> started libp2p module...`
        )
      );
    });

    // start transaction gossip from mempool reactor
    await new Promise(async (resolve) => {
      await this.mempoolReactor.initTxGossip();
      setTimeout(resolve, 2000);
      logger.info(
        chalk.magenta(
          `${chalk.green("Node Startup")}|=> Peer transaction gossip started...`
        )
      );
    });
  }
}

(async () => {

	await new Promise(async (resolve) => {
		let node_1 = Node.initNode({ peer: await Peer.fromMultiaddr("mainnet", "first") });
		let node_2 = Node.initNode({ peer: await Peer.fromMultiaddr("mainnet", "second") });

		await node_2.startNode(0, '50052');
		await node_1.startNode(0, '50051');

		setTimeout(resolve, 2000);
	});

	logger.info("ready to go...")

})()
