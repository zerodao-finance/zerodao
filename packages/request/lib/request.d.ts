import { ZeroP2P } from '@zerodao/p2p';
export declare abstract class Request {
    static PROTOCOL: string;
    constructor();
    abstract serialize(): string;
    publish(peer: ZeroP2P): Promise<void>;
}
