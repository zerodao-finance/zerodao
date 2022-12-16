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

    async getBalance(address): Promise<any> {
        return new Promise((resolve, reject) => {
			this.client.service.getBalance(address, (err: Error | string, response) => {
			  if (err) {
				reject(err)
			  } else {
				resolve(response)
			  }
			})
		  })
    }
    
}