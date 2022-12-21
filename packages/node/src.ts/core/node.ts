import { ethers } from "ethers";
import chalk = require("chalk");
import { logger } from "../logger";
import { ZeroP2P } from "@zerodao/p2p";
import { Mempool, MempoolConfig } from "../memory";
import { protocol } from "../proto";
import { Consensus } from "../consensus";
import { Proposer } from "../proposal";
import { RPCServer } from "../rpc";
import { Marshaller } from './marshall'
const timeout = async (time) => {
  await new Promise((resolve) => setTimeout(resolve, time));
};

interface NodeConfig {
  signer: ethers.Signer | ethers.Wallet;
  consensus: Consensus;
  marshaller: Marshall;
  multiaddr?: string;
}

const NodeStatus = {
  READY: "READY",
  SYNCING: "SYNCING",
  NOT_READY: "NOT_READY",
  FAILED: "FAILED",
} as const;

type NODE_STATUS = typeof NodeStatus[keyof typeof NodeStatus];

export class ZeroNode {
  public logger;
  public status: NODE_STATUS = NODE_STATUS.NOT_READY; // defaults to NOT_READY status
  public signer: ethers.Signer;

  private marshaller;
  private engine;

  async init({ signer, consensus, multiaddr }: Partial<NodeConfig> = {
    signer: ethers.Wallet.createRandom(),
    consensus: new Consensus()
  }) {
    let marshaller = new Marshaller.init(signer, multiaddr || undefined);
    return new ZeroNode({
      signer,
      consensus,
      marshaller
    });
  }

  constructor({ signer, consensus, marshaller }: NodeConfig) {
    Object.assign(this, {
      consensus,
      signer,
      marshaller
    });
  }
  
  async start() {
    try {
      await new Promise((resolve, reject) => {
        this.marshaller.startService();
        this.status = NODE_STATUS.SYNCING;

        timeout(1000);

        resolve(this.marshaller.sync());
      });
      this.status = NODE_STATUS.READY;
    } catch (error) {
      this.status = NODE_STATUS.FAILED;
      throw error;
    }    
     
  }

}