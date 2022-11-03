import { BurnRequest } from "./BurnRequest";
import { TransferRequest } from "./TransferRequest";
import { TransferRequestV2 } from "./TransferRequestV2";
import { BytesLike } from "@ethersproject/bytes";
export declare function deserialize(data: BytesLike): import("./Request").Request;
export declare function fromPlainObject(data: any): BurnRequest | TransferRequest | TransferRequestV2;
export declare function fromJSON(data: string): BurnRequest | TransferRequest | TransferRequestV2;
//# sourceMappingURL=deserialize.d.ts.map