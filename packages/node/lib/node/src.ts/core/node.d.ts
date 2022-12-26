import { ethers } from "ethers";
import { Consensus } from "../consensus";
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
};
type NODE_STATUS = typeof NODE_STATUS[keyof typeof NODE_STATUS];
export declare class ZeroNode {
    logger: any;
    status: NODE_STATUS;
    signer: ethers.Signer;
    private marshaller;
    private engine;
    private db;
    init({ signer, consensus, multiaddr }?: Partial<NodeConfig>): Promise<ZeroNode>;
    constructor({ signer, consensus, marshaller }: NodeConfig);
    start(): Promise<void>;
}
export {};
