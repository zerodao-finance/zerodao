export declare class ZeroNode {
    static fromSigner(signer: any): Promise<ZeroNode>;
    constructor({ consensus, signer, peer }: {
        consensus: any;
        signer: any;
        peer: any;
    });
}
