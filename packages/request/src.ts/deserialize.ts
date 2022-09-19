import { BurnRequest } from "./BurnRequest";
import { TransferRequest } from "./TransferRequest";
import { TransferRequestV2 } from "./TransferRequestV2";
import { decode } from "@ethersproject/rlp";
import { arrayify, BytesLike } from "@ethersproject/bytes";

export async function deserialize(data: BytesLike) {
  const decoded = decode(data);
  if (decoded.length < 8 || decoded.length > 9) throw Error('No request type has ' + decoded.length + ' fields');
  if (decoded.length === 9) return TransferRequest.deserialize(data);
  if (arrayify(decoded[7]).length === 65) return BurnRequest.deserialize(decoded);
  return TransferRequestV2.deserialize(data);
}
