import { Client } from './client'
import { Transaction } from '../proto/Transaction';
import { TransactionReply } from '../proto/TransactionReply';

export class Provider {
    client: Client;
    constructor(server?: string) {
         this.client = new Client(server)
    }

    async call(data: Transaction) {
        const response: TransactionReply = await this.client.handleTransaction(data);
        return response;
    }
    
}