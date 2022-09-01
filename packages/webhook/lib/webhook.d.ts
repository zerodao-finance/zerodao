import { Signer } from "@ethersproject/abstract-signer";
import { Request } from "@zerodao/request";
export declare const zeroWebhookMiddleware: () => (req: any, res: any, next: any, end: any) => void;
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
