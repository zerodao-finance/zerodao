/// <reference types="node" />
import { ZeroP2P } from '@zerodao/p2p';
declare abstract class Request {
    static PROTOCOL: string;
    constructor(params: any);
    serialize(): Buffer;
    publish(peer: ZeroP2P): Promise<void>;
}
export default Request;
