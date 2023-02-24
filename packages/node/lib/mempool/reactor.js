"use strict";
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
MempoolReactor.prototype.initTxGossip = async function () {
    this.gossip = await this.p2p.createPubsubProtocol(this.gossipService, async (msg) => {
        let { data, from } = msg;
        let tx = protobuf_1.protocol.Transaction.decode(data);
        let [rsp, err] = this.proxy.checkTx(tx);
        if (err)
            logger_1.logger.error(`got error: ${err} from transaction recieved from ${from}`);
        logger_1.logger.log({
            level: "verbose",
            message: `heard message by: ${this.p2p.peerId} \n From Peer ${from}  \n Message Recieved ${msg} with response ${rsp}`
        });
    });
    this.canGossip = true;
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