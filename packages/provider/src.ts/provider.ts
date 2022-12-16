import { Client } from './client'
import { Transaction } from '../../protobuf/generated/Transaction';
import { TransactionReply } from '../../protobuf/generated/TransactionReply';

export class Provider {
    client: Client;
    constructor(server?: string) {
         this.client = new Client(server)
    }

    async call(data: Transaction): Promise<TransactionReply> {
        return await this.client.handleTransaction(data);
    }
    
}