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
const service_1 = require("../rpc/service");
const logger_1 = require("../logger");
const protobuf_1 = require("@zerodao/protobuf");
class MempoolReactor extends service_1.Service {
    constructor({ proxyApp, peer, canGossip }) {
        super();
        this.gossipService = "zero/v.1/gossip/transaction";
        this.canGossip = false; // @defaults false
        this.p2p = undefined;
        this.proxy = undefined; // change to proxy app abstract class instance
        this.gossip = undefined;
        this.p2p = peer;
        this.proxy = proxyApp;
        this.serviceMethods.push("zero_sendTransaction");
    }
    setCanGossip() {
        return __awaiter(this, void 0, void 0, function* () {
            this.gossip = yield this.p2p.createPubsubProtocol(this.gossipService, (msg) => __awaiter(this, void 0, void 0, function* () {
                let { data, from } = msg;
                let [rsp, err] = this.proxy.checkTx(protobuf_1.protocol.Transaction.decode(data));
                if (err)
                    logger_1.logger.error(`got error: ${err} from transaction recieved from ${from}`);
                logger_1.logger.log({
                    level: 'verbose',
                    message: `heard message from: ${this.p2p.peerId} \n from Peer ${from} \n Message recieved: ${msg} with response ${rsp}`
                });
            }));
            this.canGossip = true;
        });
    }
    zero_sendTransaction(call, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            let [rsp, err] = yield this.proxy.checkTx(call.request);
            let encoded_msg = protobuf_1.protocol.Transaction.encode(call.request).finish();
            if (err)
                callback(null, { status: "ERROR" });
            if (this.canGossip && !err && typeof this.gossip != 'undefined') {
                logger_1.logger.info(`broadcasting message by: ${this.p2p.peerId} \n Message Gossiped: ${rsp}`);
                this.gossip(this.gossipService, encoded_msg);
                callback(null, (msg) => rsp);
            }
        });
    }
}
exports.MempoolReactor = MempoolReactor;
//# sourceMappingURL=reactor_v2.js.map