import { Redis } from "ioredis";
import { Provider } from "@ethersproject/providers";
import { BigNumberish } from "@ethersproject/bignumber";
import { Logger } from "@zerodao/logger";
import { Signer } from "@ethersproject/abstract-signer";
export declare class Dispatcher {
    gasLimit: BigNumberish;
    logger: Logger;
    signer: Signer;
    redis: Redis;
    signers: {
        [chainId: string]: Signer;
    };
    providers: {
        [chainId: string]: Provider;
    };
    static RPC_ENDPOINTS: {
        42161: string | string[];
        10: string;
        137: string | string[];
        1: string;
        43114: string;
    };
    static ERROR_TIMEOUT: number;
    constructor({ redis, gasLimit, logger, signer }: {
        redis: any;
        gasLimit: any;
        logger: any;
        signer: any;
    });
    makeProvider(chainId: any): Provider;
    getSigner(chainId: any): Signer;
    runLoop(): Promise<void>;
    timeout(ms: any): Promise<unknown>;
    errorTimeout(): Promise<void>;
}
