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
    init(): Promise<void>;
    listenForMsg(topic: any): Promise<void>;
    startNode(): Promise<void>;
    stopNode(): Promise<void>;
    cleanup(): Promise<void>;
    ping(): Promise<void>;
    listenForPing(): Promise<void>;
}
