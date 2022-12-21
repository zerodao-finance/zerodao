import { ethers } from "ethers";
declare const NodeStatus: {
  readonly READY: "READY";
  readonly SYNCING: "SYNCING";
  readonly NOT_READY: "NOT_READY";
  readonly FAILED: "FAILED";
};
type NODE_STATUS = typeof NodeStatus[keyof typeof NodeStatus];
export declare class ZeroNode {
  logger: any;
  status: NODE_STATUS;
  signer: ethers.Signer;
  private marshaller;
  private engine;
  init({
    signer,
    consensus,
    multiaddr,
  }?: {
    signer: any;
    consensus: any;
    multiaddr: any;
  }): any;
}
export {};
