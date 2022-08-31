import { Signer } from "@ethersproject/abstract-signer";
export declare class ZeroWebhook {
    signer: Signer;
    baseUrl: string;
    constructor({ signer, baseUrl }: {
        signer: any;
        baseUrl: any;
    });
    run(): Promise<void>;
    send(request: Request): Promise<void>;
}
