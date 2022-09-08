import { Redis } from "ioredis";
import { ZeroWebhook } from "@zerodao/webhook";
import { Logger } from "@zerodao/logger";
export declare class PendingProcess {
    redis: Redis;
    logger: Logger;
    webhook: ZeroWebhook | null;
    constructor({ redis, logger }: {
        redis: any;
        logger: any;
    });
    runLoop(): Promise<void>;
    run(): Promise<Logger>;
    timeout(ms: any): Promise<unknown>;
}
