/// <reference types="node" />
import { ZeroP2P } from "@zerodao/p2p";
export declare class ZeroNode extends ZeroP2P {
    buf: any;
    _clientTopic: string;
    private _pool;
    static fromSigner(signer: any): Promise<ZeroNode>;
    constructor({ consensus, signer, peer }: {
        consensus: any;
        signer: any;
        peer: any;
    });
    _listenForClient(): Promise<void>;
    _sendMessage(topic: string, messageType: string, message: any): Promise<void>;
    _decodeMsg(message: Buffer, type: string): Promise<any>;
    _encodeMsg(message: any, type: string): Promise<any>;
}
