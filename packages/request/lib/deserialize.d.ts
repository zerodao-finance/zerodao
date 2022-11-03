import { BurnRequest } from "./BurnRequest";
import { TransferRequest } from "./TransferRequest";
import { BytesLike } from "@ethersproject/bytes";
export declare function deserialize(data: BytesLike): import("./Request").Request;
export declare function fromPlainObject(data: any): BurnRequest | TransferRequest;
export declare function fromJSON(data: string): BurnRequest | TransferRequest;
