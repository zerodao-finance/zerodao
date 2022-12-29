import { ethers } from "ethers";
import { Consensus } from "../consensus";
<<<<<<< HEAD
import { Marshaller } from './marshall';
interface NodeConfig {
    signer: ethers.Signer | ethers.Wallet;
    consensus: Consensus;
    marshaller: Marshaller;
    multiaddr?: string;
}
declare const NODE_STATUS: {
    readonly READY: "READY";
    readonly SYNCING: "SYNCING";
    readonly NOT_READY: "NOT_READY";
    readonly FAILED: "FAILED";
=======
import { Marshaller } from "./marshall";
interface NodeConfig {
  signer: ethers.Signer | ethers.Wallet;
  consensus: Consensus;
  marshaller: Marshaller;
  multiaddr?: string;
}
declare const NodeStatus: {
  readonly READY: "READY";
  readonly SYNCING: "SYNCING";
  readonly NOT_READY: "NOT_READY";
  readonly FAILED: "FAILED";
>>>>>>> 51863c81 (sketch tests)
};
type NODE_STATUS = typeof NODE_STATUS[keyof typeof NODE_STATUS];
export declare class ZeroNode {
<<<<<<< HEAD
    logger: any;
    status: NODE_STATUS;
    signer: ethers.Signer;
    private marshaller;
    private engine;
    private db;
    init({ signer, consensus, multiaddr }?: Partial<NodeConfig>): Promise<ZeroNode>;
    constructor({ signer, consensus, marshaller }: NodeConfig);
    start(): Promise<void>;
=======
  logger: any;
  status: NODE_STATUS;
  signer: ethers.Signer;
  private marshaller;
  private engine;
  init({
    signer,
    consensus,
    multiaddr,
  }?: Partial<NodeConfig>): Promise<ZeroNode>;
  constructor({ signer, consensus, marshaller }: NodeConfig);
  start(): Promise<void>;
>>>>>>> 51863c81 (sketch tests)
}
export {};
