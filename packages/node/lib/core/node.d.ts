import { ethers } from "ethers";
import { MempoolConfig } from "../memory";
export declare class ZeroNode {
  _clientTopic: string;
  private pool;
  private peer;
  private signer;
  private propser;
  private protocol;
  private rpc;
  static PRESETS: {
    DEVNET: string;
  };
  static fromSigner(signer: ethers.Signer, multiaddr?: any): Promise<ZeroNode>;
  constructor({
    consensus,
    signer,
    peer,
  }: {
    consensus: any;
    signer: any;
    peer: any;
  });
  /**
   *
   * initializes mempool and starts peer pubsub
   *
   */
  init(poolConfig?: Partial<MempoolConfig>): Promise<void>;
  ping(time: any): Promise<void>;
}
