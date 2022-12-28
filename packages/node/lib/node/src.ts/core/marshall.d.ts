/// <reference types="node" />
import { ethers } from "ethers";
<<<<<<< HEAD
import { EventEmitter } from "events";
export declare class Marshaller extends EventEmitter {
    private rpc;
    private peer;
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
=======
export declare class Marshaller {
  private rpc;
  private peer;
  private memory;
  static init(signer: ethers.Signer, multiaddr?: any): Promise<Marshaller>;
  constructor({ rpc, memory, peer }: { rpc: any; memory: any; peer: any });
  startService(): Promise<void>;
  stopService(): Promise<void>;
  sync(): Promise<void>;
  proposeBlockFromMemory(height: number): Promise<void>;
  _handleInboundTransactions(): Promise<void>;
  broadcast(): Promise<void>;
  _broadcastMempool(): Promise<void>;
  _cleanupMempool(): Promise<void>;
>>>>>>> 51863c81 (sketch tests)
}
