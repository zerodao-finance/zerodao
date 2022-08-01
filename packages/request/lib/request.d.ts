/// <reference types="node" />
/// <reference types="node" />
import { ZeroP2P } from '@zerodao/p2p';
import { EventEmitter } from "events";
export declare class PublishEventEmitter extends EventEmitter {
    toPromise(): any;
}
export declare abstract class Request {
    static get PROTOCOL(): string | void;
    contractAddress?: string;
    serialize(): Buffer;
    getChainId(): string;
    publish(peer: ZeroP2P): Promise<PublishEventEmitter>;
}
