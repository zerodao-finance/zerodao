import { Signer } from "@ethersproject/abstract-signer";
import { Wallet } from "@ethersproject/wallet";
import { Request } from "@zerodao/request";
import { Logger } from "@zerodao/logger";
export declare const hashWebhookMessage: (serialized: any) => string;
declare type IZeroWebhookProps = {
    signer: Signer | Wallet | any;
    baseUrl: string;
};
export declare class ZeroWebhook {
    signer: Signer;
    baseUrl: string;
    logger: Logger;
    constructor({ signer, baseUrl }: IZeroWebhookProps);
    send(endpoint: string, request: Request): Promise<import("axios").AxiosResponse<any, any>>;
}
export {};
