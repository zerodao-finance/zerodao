export declare class ZeroNode {
    _clientTopic: string;
    private pool;
    private peer;
    private propser;
    private protocol;
    static PRESETS: {
        DEVNET: string;
    };
    static fromSigner(signer: any, multiaddr?: any): Promise<ZeroNode>;
    init(): Promise<void>;
    constructor({ consensus, signer, peer }: {
        consensus: any;
        signer: any;
        peer: any;
    });
    startNode(): Promise<void>;
    stopNode(): Promise<void>;
    cleanup(): Promise<void>;
    ping(): Promise<void>;
}
