import { Client } from "./client";
import {
  Transaction,
  TransactionReply,
  BalanceQuery,
  BalanceReply,
} from "@zerodao/protobuf";

export class Provider {
  client: Client;
  constructor(server?: string) {
    this.client = new Client(server);
  }

  async sendZeroTransaction(data: Transaction): Promise<TransactionReply> {
    return await this.client.sendZeroTransaction(data);
  }

  async getZeroBalance(data: BalanceQuery): Promise<BalanceReply> {
    return await this.client.getZeroBalance(data);
  }
}
