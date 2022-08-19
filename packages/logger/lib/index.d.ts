import "setimmediate";
import { Logger } from "winston";
declare const createLogger: (proc?: string) => Logger;
export { createLogger, Logger };
