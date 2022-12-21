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
exports.ZeroNode = void 0;
const ethers_1 = require("ethers");
const consensus_1 = require("../consensus");
const marshall_1 = require("./marshall");
const timeout = (time) => __awaiter(void 0, void 0, void 0, function* () {
    yield new Promise((resolve) => setTimeout(resolve, time));
});
const NodeStatus = {
    READY: "READY",
    SYNCING: "SYNCING",
    NOT_READY: "NOT_READY",
    FAILED: "FAILED",
};
class ZeroNode {
    init({ signer, consensus, multiaddr } = {
        signer: ethers_1.ethers.Wallet.createRandom(),
        consensus: new consensus_1.Consensus()
    }) {
        return __awaiter(this, void 0, void 0, function* () {
            let marshaller = new marshall_1.Marshaller.init(signer, multiaddr || undefined);
            return new ZeroNode({
                signer,
                consensus,
                marshaller
            });
        });
    }
    constructor({ signer, consensus, marshaller }) {
        this.status = NODE_STATUS.NOT_READY; // defaults to NOT_READY status
        Object.assign(this, {
            consensus,
            signer,
            marshaller
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield new Promise((resolve, reject) => {
                    this.marshaller.startService();
                    this.status = NODE_STATUS.SYNCING;
                    timeout(1000);
                    resolve(this.marshaller.sync());
                });
                this.status = NODE_STATUS.READY;
            }
            catch (error) {
                this.status = NODE_STATUS.FAILED;
                throw error;
            }
        });
    }
}
exports.ZeroNode = ZeroNode;
//# sourceMappingURL=node.js.map