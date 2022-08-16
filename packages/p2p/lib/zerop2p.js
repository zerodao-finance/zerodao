"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZeroP2P = void 0;
const Mplex = require("libp2p-mplex");
const libp2p_noise_1 = require("libp2p-noise");
const KadDHT = require("libp2p-kad-dht");
const Bootstrap = require("libp2p-bootstrap");
const PeerId = require("peer-id");
const GossipSub = require("libp2p-gossipsub");
const RelayConstants = require("libp2p/src/circuit/constants");
const WStar = require("libp2p-webrtc-star");
const isBrowser = require("is-browser");
const bytes_1 = require("@ethersproject/bytes");
const solidity_1 = require("@ethersproject/solidity");
const Libp2p = require("libp2p");
const libp2p_crypto_1 = __importDefault(require("libp2p-crypto"));
const wrtc = require("wrtc");
const cryptico = require("cryptico-js");
const globalObject = require("the-global-object");
const buffer_1 = require("buffer");
const lodash_1 = require("lodash");
const base64url = require("base64url");
const logger_1 = require("@zerodao/logger");
const buffer_2 = require("@zerodao/buffer");
const returnOp = (v) => v;
const logger = (0, logger_1.createLogger)();
globalObject.Buffer = globalObject.Buffer || buffer_1.Buffer;
const mapToBuffers = (o) => (0, lodash_1.mapValues)(o, (v) => base64url(v.toByteArray && buffer_1.Buffer.from(v.toByteArray()) || buffer_1.Buffer.from((0, bytes_1.hexlify)(v).substr(2), 'hex')));
const cryptoFromSeed = async function (seed) {
    const key = mapToBuffers(await cryptico.generateRSAKey(seed, 2048));
    key.dp = key.dmp1;
    key.dq = key.dmq1;
    key.qi = key.coeff;
    return libp2p_crypto_1.default.keys.supportedKeys.rsa.unmarshalRsaPrivateKey(new libp2p_crypto_1.default.keys.supportedKeys.rsa.RsaPrivateKey(key, key).marshal());
};
const coerceBuffersToHex = (v) => {
    if (v instanceof Uint8Array || buffer_1.Buffer.isBuffer(v))
        return (0, bytes_1.hexlify)(v);
    if (Array.isArray(v))
        return v.map(coerceBuffersToHex);
    if (typeof v === "object") {
        return Object.keys(v).reduce((r, key) => {
            r[key] = coerceBuffersToHex(v[key]);
            return r;
        }, {});
    }
    return v;
};
const coerceHexToBuffers = (v) => {
    if (typeof v === "string" && v.substr(0, 2) === "0x")
        return buffer_1.Buffer.from(v.substr(2), "hex");
    if (Array.isArray(v))
        return v.map(coerceHexToBuffers);
    if (typeof v === "object") {
        return Object.keys(v).reduce((r, key) => {
            r[key] = coerceHexToBuffers(v[key]);
            return r;
        }, {});
    }
    return v;
};
class ZeroP2P extends Libp2p {
    constructor(options) {
        const multiaddr = ZeroP2P.fromPresetOrMultiAddr(options.multiaddr || "mainnet");
        super({
            peerId: options.peerId,
            connectionManager: {
                minConnections: 25
            },
            relay: {
                enabled: true,
                advertise: {
                    bootDelay: RelayConstants.ADVERTISE_BOOT_DELAY,
                    enabled: false,
                    ttl: RelayConstants.ADVERTISE_TTL
                },
                hop: {
                    enabled: false,
                    active: false
                },
                autoRelay: {
                    enabled: false,
                    maxListeners: 2
                }
            },
            addresses: {
                listen: [multiaddr]
            },
            modules: {
                transport: [WStar],
                streamMuxer: [Mplex],
                connEncryption: [libp2p_noise_1.NOISE],
                pubsub: GossipSub,
                peerDiscovery: [Bootstrap],
                dht: KadDHT,
            },
            config: {
                peerDiscovery: {
                    autoDial: true,
                    [Bootstrap.tag]: {
                        enabled: true,
                        list: [
                            multiaddr + 'QmXRimgxFGd8FEFRX8FvyzTG4jJTJ5pwoa3N5YDCrytASu'
                        ],
                    },
                },
                transport: {
                    [WStar.prototype[Symbol.toStringTag]]: {
                        wrtc: !isBrowser && wrtc,
                    },
                },
                dht: {
                    enabled: true,
                    kBucketSize: 20,
                },
                pubsub: {
                    enabled: true,
                    emitSelf: false,
                },
            },
        });
        this.logger = logger;
        this.logger.debug("listening on", multiaddr);
        this.setSigner(options.signer);
    }
    static fromPresetOrMultiAddr(multiaddr) {
        return this.PRESETS[(multiaddr || '').toUpperCase() || 'MAINNET'] || multiaddr;
    }
    static toMessage(password) {
        return ("/zerop2p/1.0.0/" +
            (0, solidity_1.keccak256)(["string"], ["/zerop2p/1.0.0/" + password]));
    }
    static async peerIdFromSeed(seed) {
        return await PeerId.createFromPrivKey((await cryptoFromSeed(seed)).bytes);
    }
    static async fromSeed({ signer, seed, multiaddr }) {
        return new this({
            peerId: await this.peerIdFromSeed(seed),
            multiaddr,
            signer,
        });
    }
    static async fromPassword({ signer, multiaddr, password }) {
        return await this.fromSeed({
            signer,
            multiaddr,
            seed: await signer.signMessage(this.toMessage(password)),
        });
    }
    async start() {
        await super.start();
        await this.pubsub.start();
    }
    setSigner(signer) {
        this.signer = signer;
        this.addressPromise = this.signer.getAddress();
    }
    async subscribeKeepers() {
        await this.pubsub.subscribe("zero.keepers", async (message) => {
            const { data, from } = message;
            const { address } = (0, buffer_2.fromBufferToJSON)(data);
            if (!this._keepers.includes(from)) {
                this._keepers.push(from);
                this.emit("keeper:discovery", from);
            }
        });
    }
    async unsubscribeKeepers() {
        await this.pubsub.unsubscribe("zero.keepers");
        this._keepers = [];
    }
}
exports.ZeroP2P = ZeroP2P;
ZeroP2P.PRESETS = {
    MAINNET: '/dns4/p2p.zerodao.com/tcp/443/wss/p2p-webrtc-star/',
    'DEV-MAINNET': '/dns4/devp2p.zerodao.com/tcp/443/wss/p2p-webrtc-star/'
};
;
//# sourceMappingURL=zerop2p.js.map