import { Signer } from "@ethersproject/abstract-signer";
import { Wallet } from "@ethersproject/wallet";
import { Request } from "@zerodao/request";
import { Logger } from "@zerodao/logger";
export declare const hashWebhookMessage: (serialized: any) => string;
declare type IZeroWebhookProps = {
    signer: Signer | Wallet | any;
    baseUrl: string;
    logger?: Logger;
};
export declare class ZeroWebhook {
    signer: Signer;
    baseUrl: string;
    logger: Logger;
    constructor({ signer, baseUrl, logger }: IZeroWebhookProps);
    send(request: Request): Promise<import("axios").AxiosResponse<any, any>>;
}
export {};
