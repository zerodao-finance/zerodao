import { Signer } from "@ethersproject/abstract-signer";
import { Request } from "@zerodao/request";
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
