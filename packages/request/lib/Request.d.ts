/// <reference types="node" />
import type { ZeroP2P } from "@zerodao/p2p";
import { PublishEventEmitter } from "./PublishEventEmitter";
export declare abstract class Request {
    static addressToChainId(address: any): any;
    static get PROTOCOL(): string | void;
    contractAddress?: string;
    serialize(): Buffer;
    getChainId(): number;
    publish(peer: ZeroP2P): Promise<PublishEventEmitter>;
}
