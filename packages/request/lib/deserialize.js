"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromJSON = exports.fromPlainObject = exports.deserialize = void 0;
const BurnRequest_1 = require("./BurnRequest");
const TransferRequest_1 = require("./TransferRequest");
const TransferRequestV2_1 = require("./TransferRequestV2");
const rlp_1 = require("@ethersproject/rlp");
const bytes_1 = require("@ethersproject/bytes");
function deserialize(data) {
    const decoded = (0, rlp_1.decode)(data);
    if (decoded.length < 8 || decoded.length > 9)
        throw Error('No request type has ' + decoded.length + ' fields');
    if (decoded.length === 9)
        return TransferRequest_1.TransferRequest.deserialize(data);
    if ((0, bytes_1.arrayify)(decoded[7]).length === 65)
        return BurnRequest_1.BurnRequest.deserialize(data);
    return TransferRequestV2_1.TransferRequestV2.deserialize(data);
}
exports.deserialize = deserialize;
function fromPlainObject(data) {
    if (data.destination)
        return new BurnRequest_1.BurnRequest(data);
    if (data.loanId)
        return new TransferRequestV2_1.TransferRequestV2(data);
    return new TransferRequest_1.TransferRequest(data);
}
exports.fromPlainObject = fromPlainObject;
function fromJSON(data) {
    const parsed = JSON.parse(data);
    return fromPlainObject(parsed);
}
exports.fromJSON = fromJSON;
//# sourceMappingURL=deserialize.js.map