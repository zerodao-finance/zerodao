import { Logger } from 'winston';
import { UserTypes } from './types';
declare const createLogger: (userType?: UserTypes) => any;
export default createLogger;
export { Logger };
