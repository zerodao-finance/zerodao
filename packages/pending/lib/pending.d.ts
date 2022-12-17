import { Redis } from "ioredis";
import { Logger } from "@zerodao/logger";
export declare class PendingProcess {
  redis: Redis;
  logger: Logger;
  constructor({ redis, logger }: { redis: any; logger: any });
  runLoop(): Promise<void>;
  run(): Promise<Logger>;
  timeout(ms: any): Promise<unknown>;
}
