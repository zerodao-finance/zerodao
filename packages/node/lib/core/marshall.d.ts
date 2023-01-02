/// <reference types="node" />
import { ZeroP2P } from "@zerodao/p2p";
import { ethers } from "ethers";
import { EventEmitter } from "events";
export declare class Marshaller extends EventEmitter {
    peer: ZeroP2P;
    private rpc;
    private memory;
    static init(signer: ethers.Signer, multiaddr?: any): Promise<Marshaller>;
    constructor({ rpc, memory, peer }: {
        rpc: any;
        memory: any;
        peer: any;
    });
    startService(): Promise<void>;
    stopService(): Promise<void>;
    sync(): Promise<void>;
    proposeBlockFromMemory(height: number): Promise<void>;
    _handleInboundTransactions(): Promise<void>;
    broadcast(): Promise<void>;
    _broadcastMempool(): Promise<void>;
    _cleanupMempool(): Promise<void>;
}
