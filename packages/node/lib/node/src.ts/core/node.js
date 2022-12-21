"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZeroNode = void 0;
const chalk = require("chalk");
const logger_1 = require("../logger");
const p2p_1 = require("@zerodao/p2p");
const memory_1 = require("../memory");
const proto_1 = require("../proto");
const consensus_1 = require("../consensus");
const rpc_1 = require("../rpc");
const timeout = (time) =>
  __awaiter(void 0, void 0, void 0, function* () {
    yield new Promise((resolve) => setTimeout(resolve, time));
  });
const timeoutWithCallback = (time, callback) =>
  __awaiter(void 0, void 0, void 0, function* () {
    yield new Promise((resolve) => setTimeout(callback(resolve), time));
  });
class ZeroNode {
<<<<<<< HEAD
    constructor({ consensus, signer, peer }) {
        this._clientTopic = "zeronode.v1.inbound";
        Object.assign(this, {
            consensus,
            signer,
            peer,
            protocol: proto_1.protocol,
        });
    }
    static fromSigner(signer, multiaddr) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info("generating seed from secp256k1 signature");
            const seed = yield signer.signMessage(p2p_1.ZeroP2P.toMessage(yield signer.getAddress()));
            logger_1.logger.info("creating peer from seed, wait for complete ...");
            const peer = yield p2p_1.ZeroP2P.fromSeed({
                signer,
                seed: Buffer.from(seed.substring(2), "hex"),
                multiaddr: multiaddr || ZeroNode.PRESETS.DEVNET,
            });
            yield new Promise((resolve) => {
                peer.start();
                peer.on("peer:discover", (peerInfo) => __awaiter(this, void 0, void 0, function* () {
                    logger_1.logger.info(`found peer \n ${peerInfo}`);
                }));
                resolve(console.timeLog("node:start-up"));
            });
            yield timeout(5000);
            logger_1.logger.info("done!");
            logger_1.logger.info("zerop2p address " + chalk.bold(peer.peerId.toB58String()));
            console.timeEnd("node:start-up");
            return new this({
                consensus: new consensus_1.Consensus(),
                peer,
                signer,
            });
        });
    }
    /**
     *
     * initializes mempool and starts peer pubsub
     *
     */
    init(poolConfig = {
        peer: this.peer,
    }) {
        return __awaiter(this, void 0, void 0, function* () {
            this.pool = memory_1.Mempool.init(poolConfig);
            this.rpc = rpc_1.RPCServer.init();
            yield this.rpc.start();
        });
    }
    __rpc() {
        return __awaiter(this, void 0, void 0, function* () {
            //start rpc server listening
        });
    }
    __handle_tx() {
        return __awaiter(this, void 0, void 0, function* () {
            //handle rpc server messages
        });
    }
    // implement mempool interface
    ping(time) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.peer.pubsub.subscribe("zerodao.V1.pingpong", (msg) => __awaiter(this, void 0, void 0, function* () {
                logger_1.logger.info(`heard message ${msg}`);
                if (msg == "ping") {
                    yield this.peer.pubsub.publish("zerodao.V1.pingong", new TextEncoder().encode("pong"));
                }
            }));
            logger_1.logger.info("\n gossiping ping to the network");
            yield this.peer.pubsub.publish("zerodao.V1.pingpong", new TextEncoder().encode("ping"));
        });
=======
  static fromSigner(signer, multiaddr) {
    return __awaiter(this, void 0, void 0, function* () {
      logger_1.logger.info("generating seed from secp256k1 signature");
      const seed = yield signer.signMessage(
        p2p_1.ZeroP2P.toMessage(yield signer.getAddress())
      );
      logger_1.logger.info("creating peer from seed, wait for complete ...");
      const peer = yield p2p_1.ZeroP2P.fromSeed({
        signer,
        seed: Buffer.from(seed.substring(2), "hex"),
        multiaddr: multiaddr || ZeroNode.PRESETS.DEVNET,
      });
      yield new Promise((resolve) => {
        peer.start();
        peer.on("peer:discover", (peerInfo) =>
          __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`found peer \n ${peerInfo}`);
          })
        );
        resolve(console.timeLog("node:start-up"));
      });
      yield timeout(5000);
      logger_1.logger.info("done!");
      logger_1.logger.info(
        "zerop2p address " + chalk.bold(peer.peerId.toB58String())
      );
      console.timeEnd("node:start-up");
      return new this({
        consensus: new consensus_1.Consensus(),
        peer,
        signer,
      });
    });
  }
  constructor({ consensus, signer, peer }) {
    this._clientTopic = "zeronode.v1.inbound";
    const pool = memory_1.Mempool.init({ peer: this.peer });
    const rpc = rpc_1.RPCServer.init();
    Object.assign(this, {
      consensus,
      signer,
      peer,
      rpc,
      protocol: proto_1.protocol,
      pool,
    });
  }
  /**
   *
   * initializes mempool and starts peer pubsub
   *
   */
  init(
    poolConfig = {
      peer: this.peer,
>>>>>>> aed/node
    }
  ) {
    return __awaiter(this, void 0, void 0, function* () {
      this.pool = memory_1.Mempool.init(poolConfig);
      logger_1.logger.info("\n networking stack starting \n");
      yield this.peer.start();
      yield new Promise((resolve) => {
        this.peer.start();
        this.peer.on("peer:discovery", (peerInfo) =>
          __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`found peer \n ${peerInfo}`);
          })
        );
        resolve(undefined);
      });
      yield timeout(10000);
      yield this.rpc.start();
    });
  }
  ping(time) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.peer.pubsub.subscribe("zerodao.V1.pingpong", (msg) =>
        __awaiter(this, void 0, void 0, function* () {
          logger_1.logger.info(`heard message ${msg}`);
          if (msg == "ping") {
            yield this.peer.pubsub.publish(
              "zerodao.V1.pingong",
              new TextEncoder().encode("pong")
            );
          }
        })
      );
      logger_1.logger.info("\n gossiping ping to the network");
      yield this.peer.pubsub.publish(
        "zerodao.V1.pingpong",
        new TextEncoder().encode("ping")
      );
    });
  }
}
exports.ZeroNode = ZeroNode;
ZeroNode.PRESETS = {
  DEVNET: "",
};
//# sourceMappingURL=node.js.map
