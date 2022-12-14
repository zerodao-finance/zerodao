import { Client } from './client';
import { Transaction } from '../proto/Transaction';
export declare class Provider {
    client: Client;
    constructor(server?: string);
    call(data: Transaction): Promise<any>;
}
