import { ZeroP2P } from "@zerodao/p2p";
import { ethers } from "ethers";
import PeerId from "peer-id";
export declare class Peer extends ZeroP2P {
    peerId: any;
    wallet_key: any;
    static peerIdFromNodeKey(nodeKey: any): Promise<PeerId>;
    static fromConfig(path?: string): Promise<Peer>;
    static createKey(): Promise<PeerId>;
    static createSigner(): ethers.Wallet;
    static fromMultiaddr(multiaddr: string, profile?: string): Promise<Peer>;
    constructor(options: any);
    createPubsubProtocol(topic: any, callback: any): Promise<any>;
    saveConfig(options: any): void;
}
