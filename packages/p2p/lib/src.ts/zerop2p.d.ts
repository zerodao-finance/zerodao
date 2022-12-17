import PeerId = require("peer-id");
import Libp2p = require("libp2p");
import { Signer } from "@ethersproject/abstract-signer";
import { Logger } from "@zerodao/logger";
export declare class ZeroP2P extends Libp2p {
  _keepers: Array<string>;
  logger: Logger;
  signer: Signer;
  addressPromise: Promise<string>;
  static PRESETS: {
    MAINNET: string;
    "DEV-MAINNET": string;
  };
  static fromPresetOrMultiAddr(multiaddr: any): any;
  static toMessage(password: any): string;
  static peerIdFromSeed(seed: any): Promise<PeerId>;
  static fromSeed({
    signer,
    seed,
    multiaddr,
  }: {
    signer: any;
    seed: any;
    multiaddr: any;
  }): Promise<ZeroP2P>;
  static fromPassword({
    signer,
    multiaddr,
    password,
  }: {
    signer: any;
    multiaddr: any;
    password: any;
  }): Promise<ZeroP2P>;
  start(): Promise<void>;
  setSigner(signer: any): void;
  constructor(options: any);
  subscribeKeepers(): Promise<void>;
  unsubscribeKeepers(): Promise<void>;
}
