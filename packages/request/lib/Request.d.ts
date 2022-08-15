/// <reference types="node" />
import { ZeroP2P } from '@zerodao/p2p';
import { PublishEventEmitter } from "./PublishEventEmitter";
export declare abstract class Request {
    static get PROTOCOL(): string | void;
    contractAddress?: string;
    serialize(): Buffer;
    getChainId(): number;
    publish(peer: ZeroP2P): Promise<PublishEventEmitter>;
}
