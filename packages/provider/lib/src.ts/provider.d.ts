import { Client } from "./client";
import { Transaction } from "../proto/Transaction";
import { TransactionReply } from "../proto/TransactionReply";
export declare class Provider {
  client: Client;
  constructor(server?: string);
  call(data: Transaction): Promise<TransactionReply>;
}
