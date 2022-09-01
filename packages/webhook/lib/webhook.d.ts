import { Signer } from "@ethersproject/abstract-signer";
import { Request } from "@zerodao/request";
export declare const hashWebhookMessage: (serialized: any) => string;
export declare class ZeroWebhook {
    signer: Signer;
    baseUrl: string;
    constructor({ signer, baseUrl }: {
        signer: any;
        baseUrl: any;
    });
    send(request: Request): Promise<void>;
}
