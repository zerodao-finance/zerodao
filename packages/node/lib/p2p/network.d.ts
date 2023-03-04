import { ZeroP2P } from "@zerodao/p2p";
import { ethers } from "ethers";
import PeerId from "peer-id";
export declare class Peer extends ZeroP2P {
    peerId: any;
    wallet_key: any;
    savePath: string;
    static fromConfig(path?: string): Promise<Peer>;
    static fromMultiaddr(multiaddr: string, profile?: string): Promise<Peer>;
    static peerIdFromNodeKey(nodeKey: any): Promise<PeerId>;
    static createSigner(): ethers.Wallet;
    static createKey(): Promise<PeerId>;
    static createConfigDir(): void;
    constructor(options: any);
    createPubsubProtocol(topic: any, callback: any): Promise<any>;
    saveConfig(options: any): void;
}
