/// <reference types="node" />
import { ZeroP2P } from '@zerodao/p2p';
declare abstract class Request {
    static PROTOCOL: string;
    contractAddress?: string;
    constructor();
    serialize(): Buffer;
    getChainId(): string;
    publish(peer: ZeroP2P): Promise<void>;
}
export default Request;
