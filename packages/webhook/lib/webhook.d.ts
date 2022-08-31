import { Redis } from "ioredis";
export declare class ZeroWebhook {
    redis: Redis;
    constructor({ redis }: {
        redis: any;
    });
    run(): Promise<void>;
    timeout(ms: any): Promise<unknown>;
}
