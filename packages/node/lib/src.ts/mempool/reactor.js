"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MempoolReactor = void 0;
const protobuf_1 = require("@zerodao/protobuf");
const logger_1 = require("../logger");
function MempoolReactor(proxy, p2p) {
    this.proxy = proxy;
    this.p2p = p2p;
    this.serviceMethods = ['zero_sendTransaction'];
    this.gossipService = "zero/v.1/gossip/transaction";
    this.canGossip = false;
    this.gossip = undefined;
}
exports.MempoolReactor = MempoolReactor;
MempoolReactor.prototype.initTxGossip = function () {
    return __awaiter(this, void 0, void 0, function* () {
        // TODO: implement async checkTx function
        this.gossip = yield this.p2p.createPubsubProtocol(this.gossipService, (msg) => __awaiter(this, void 0, void 0, function* () {
            let { data, from } = msg;
            let tx = protobuf_1.protocol.Transaction.decode(data);
            let [rsp, err] = this.proxy.checkTx(tx);
            if (err)
                throw new Error(`got error: ${err} from transaction recieved from ${from}`);
            logger_1.logger.info(`heard message by: ${this.p2p.peerId} \n From Peer ${from}  \n Message Recieved ${msg} with response ${rsp}`);
        }));
        this.canGossip = true;
    });
};
MempoolReactor.prototype.zero_sendTransaction = function (call, callback) {
    let [rsp, err] = this.proxy.checkTx(call.request);
    let encoded_msg = protobuf_1.protocol.Transaction.encode(call.request).finish();
    if (this.canGossip) {
        logger_1.logger.info(`broadcasting message by: ${this.p2p.peerId} \n Message Gossipped: ${rsp}`);
        console.log(encoded_msg);
        this.gossip(this.gossipService, encoded_msg);
    }
    if (!err) {
        callback(null, (msg) => rsp);
    }
    else {
        callback(null, { status: "ERROR" });
    }
};
//# sourceMappingURL=reactor.js.map