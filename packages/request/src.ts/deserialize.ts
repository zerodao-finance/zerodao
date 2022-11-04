import { BurnRequest } from "./BurnRequest";
import { TransferRequest } from "./TransferRequest";
import { TransferRequestV2 } from "./TransferRequestV2";
import { decode } from "@ethersproject/rlp";
import { arrayify, BytesLike } from "@ethersproject/bytes";

export function deserialize(data: BytesLike) {
	console.log(data);
  const decoded = decode(arrayify(data));
  if (decoded.length < 8 || decoded.length > 9) throw Error('No request type has ' + decoded.length + ' fields');
  if (decoded.length === 9) return TransferRequest.deserialize(data);
  if (arrayify(decoded[7]).length === 65) return BurnRequest.deserialize(data);
  return TransferRequestV2.deserialize(data);
}

export function fromPlainObject(data: any) {
  if (data.destination) return new BurnRequest(data);
  if (data.loanId) return new TransferRequestV2(data);
  return new TransferRequest(data);
}

export function fromJSON(data: string) {
  const parsed = JSON.parse(data);
  return fromPlainObject(parsed);
}
