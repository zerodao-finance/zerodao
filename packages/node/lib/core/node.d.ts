import { ZeroPoolConfig } from "../memory";
export declare class ZeroNode {
    _clientTopic: string;
    private pool;
    private peer;
    private protocol;
    static PRESETS: {
        DEVNET: string;
    };
    static fromSigner(signer: any, multiaddr?: any): Promise<ZeroNode>;
    constructor({ consensus, signer, peer }: {
        consensus: any;
        signer: any;
        peer: any;
    });
    /**
     *
     * initializes mempool and starts peer pubsub
     *
     */
    init(poolConfig: ZeroPoolConfig): Promise<void>;
    startNode(): Promise<void>;
    stopNode(): Promise<void>;
    cleanup(): Promise<void>;
    ping(): Promise<void>;
}
