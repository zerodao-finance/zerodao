type UnaryCallHandler = (call: any, callback: any) => void;
interface ITransactionService {
  handleTransaction: UnaryCallHandler;
}
export declare const TransactionService: ITransactionService;
export {};
