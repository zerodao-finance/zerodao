import { Redis } from "ioredis";
import { Logger } from "@zerodao/logger";
export declare class WatcherProcess {
    logger: Logger;
    redis: Redis;
    constructor({ logger, redis }: {
        logger: any;
        redis: any;
    });
    run(): Promise<void>;
    runLoop(): Promise<void>;
    timeout(ms: any): Promise<unknown>;
}
