import { Logger } from "winston";
import { UserTypes } from "./types";
declare const createLogger: (userType?: UserTypes) => Logger;
export { createLogger, Logger };
