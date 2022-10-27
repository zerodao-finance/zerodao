"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZeroP2P = void 0;
var bytes_1 = require("@ethersproject/bytes");
var solidity_1 = require("@ethersproject/solidity");
var libp2p_crypto_1 = __importDefault(require("libp2p-crypto"));
var buffer_1 = require("buffer");
var lodash_1 = require("lodash");
require("@ethersproject/abstract-signer");
var logger_1 = require("@zerodao/logger");
var buffer_2 = require("@zerodao/buffer");
var libp2p_noise_1 = require("libp2p-noise");
var Mplex = require("libp2p-mplex");
var KadDHT = require("libp2p-kad-dht");
var Bootstrap = require("libp2p-bootstrap");
var PeerId = require("peer-id");
var GossipSub = require("libp2p-gossipsub");
var RelayConstants = require("libp2p/src/circuit/constants");
var WStar = require("libp2p-webrtc-star");
var Libp2p = require("libp2p");
var isBrowser = require("is-browser");
var wrtc = require("wrtc");
var globalObject = require("the-global-object");
var base64url = require("base64url");
var cryptico = require("cryptico-js");
var returnOp = function (v) { return v; };
var logger = (0, logger_1.createLogger)("@zerodao/p2p");
globalObject.Buffer = globalObject.Buffer || buffer_1.Buffer;
var mapToBuffers = function (o) {
    return (0, lodash_1.mapValues)(o, function (v) {
        return base64url((v.toByteArray && buffer_1.Buffer.from(v.toByteArray())) ||
            buffer_1.Buffer.from((0, bytes_1.hexlify)(v).substr(2), "hex"));
    });
};
var cryptoFromSeed = function (seed) {
    return __awaiter(this, void 0, void 0, function () {
        var key, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = mapToBuffers;
                    return [4 /*yield*/, cryptico.generateRSAKey(seed, 2048)];
                case 1:
                    key = _a.apply(void 0, [_b.sent()]);
                    key.dp = key.dmp1;
                    key.dq = key.dmq1;
                    key.qi = key.coeff;
                    return [2 /*return*/, libp2p_crypto_1.default.keys.supportedKeys.rsa.unmarshalRsaPrivateKey(new libp2p_crypto_1.default.keys.supportedKeys.rsa.RsaPrivateKey(key, key).marshal())];
            }
        });
    });
};
var coerceBuffersToHex = function (v) {
    if (v instanceof Uint8Array || buffer_1.Buffer.isBuffer(v))
        return (0, bytes_1.hexlify)(v);
    if (Array.isArray(v))
        return v.map(coerceBuffersToHex);
    if (typeof v === "object") {
        return Object.keys(v).reduce(function (r, key) {
            r[key] = coerceBuffersToHex(v[key]);
            return r;
        }, {});
    }
    return v;
};
var coerceHexToBuffers = function (v) {
    if (typeof v === "string" && v.substr(0, 2) === "0x")
        return buffer_1.Buffer.from(v.substr(2), "hex");
    if (Array.isArray(v))
        return v.map(coerceHexToBuffers);
    if (typeof v === "object") {
        return Object.keys(v).reduce(function (r, key) {
            r[key] = coerceHexToBuffers(v[key]);
            return r;
        }, {});
    }
    return v;
};
var ZeroP2P = /** @class */ (function (_super) {
    __extends(ZeroP2P, _super);
    function ZeroP2P(options) {
        var _a, _b;
        var _this = this;
        var multiaddr = ZeroP2P.fromPresetOrMultiAddr(options.multiaddr || "mainnet");
        _this = _super.call(this, {
            peerId: options.peerId,
            connectionManager: {
                minConnections: 25,
            },
            relay: {
                enabled: true,
                advertise: {
                    bootDelay: RelayConstants.ADVERTISE_BOOT_DELAY,
                    enabled: false,
                    ttl: RelayConstants.ADVERTISE_TTL,
                },
                hop: {
                    enabled: false,
                    active: false,
                },
                autoRelay: {
                    enabled: false,
                    maxListeners: 2,
                },
            },
            addresses: {
                listen: [multiaddr],
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
                peerDiscovery: (_a = {
                        autoDial: true
                    },
                    _a[Bootstrap.tag] = {
                        enabled: true,
                        list: [
                            multiaddr + "QmXRimgxFGd8FEFRX8FvyzTG4jJTJ5pwoa3N5YDCrytASu",
                        ],
                    },
                    _a),
                transport: (_b = {},
                    _b[WStar.prototype[Symbol.toStringTag]] = {
                        wrtc: !isBrowser && wrtc,
                    },
                    _b),
                dht: {
                    enabled: true,
                    kBucketSize: 20,
                },
                pubsub: {
                    enabled: true,
                    emitSelf: false,
                },
            },
        }) || this;
        _this._keepers = [];
        _this.logger = logger;
        _this.logger.debug("listening on", multiaddr);
        _this.setSigner(options.signer);
        return _this;
    }
    ZeroP2P.fromPresetOrMultiAddr = function (multiaddr) {
        return (this.PRESETS[(multiaddr || "").toUpperCase() || "MAINNET"] || multiaddr);
    };
    ZeroP2P.toMessage = function (password) {
        return ("/zerop2p/1.0.0/" + (0, solidity_1.keccak256)(["string"], ["/zerop2p/1.0.0/" + password]));
    };
    ZeroP2P.peerIdFromSeed = function (seed) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = PeerId).createFromPrivKey;
                        return [4 /*yield*/, cryptoFromSeed(seed)];
                    case 1: return [4 /*yield*/, _b.apply(_a, [(_c.sent()).bytes])];
                    case 2: return [2 /*return*/, _c.sent()];
                }
            });
        });
    };
    ZeroP2P.fromSeed = function (_a) {
        var signer = _a.signer, seed = _a.seed, multiaddr = _a.multiaddr;
        return __awaiter(this, void 0, void 0, function () {
            var _b;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _b = this.bind;
                        _c = {};
                        return [4 /*yield*/, this.peerIdFromSeed(seed)];
                    case 1: return [2 /*return*/, new (_b.apply(this, [void 0, (_c.peerId = _d.sent(),
                                _c.multiaddr = multiaddr,
                                _c.signer = signer,
                                _c)]))()];
                }
            });
        });
    };
    ZeroP2P.fromPassword = function (_a) {
        var signer = _a.signer, multiaddr = _a.multiaddr, password = _a.password;
        return __awaiter(this, void 0, void 0, function () {
            var _b;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _b = this.fromSeed;
                        _c = {
                            signer: signer,
                            multiaddr: multiaddr
                        };
                        return [4 /*yield*/, signer.signMessage(this.toMessage(password))];
                    case 1: return [4 /*yield*/, _b.apply(this, [(_c.seed = _d.sent(),
                                _c)])];
                    case 2: return [2 /*return*/, _d.sent()];
                }
            });
        });
    };
    ZeroP2P.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype.start.call(this)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.pubsub.start()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ZeroP2P.prototype.setSigner = function (signer) {
        this.signer = signer;
        this.addressPromise = this.signer.getAddress();
    };
    ZeroP2P.prototype.subscribeKeepers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pubsub.subscribe("zero.keepers", function (message) { return __awaiter(_this, void 0, void 0, function () {
                            var data, from, address;
                            return __generator(this, function (_a) {
                                data = message.data, from = message.from;
                                address = (0, buffer_2.fromBufferToJSON)(data).address;
                                if (!this._keepers.includes(from)) {
                                    this._keepers.push(from);
                                    this.emit("keeper:discovery", from);
                                }
                                return [2 /*return*/];
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ZeroP2P.prototype.unsubscribeKeepers = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pubsub.unsubscribe("zero.keepers")];
                    case 1:
                        _a.sent();
                        this._keepers = [];
                        return [2 /*return*/];
                }
            });
        });
    };
    ZeroP2P.PRESETS = {
        MAINNET: "/dns4/p2p.zerodao.com/tcp/443/wss/p2p-webrtc-star/",
        "DEV-MAINNET": "/dns4/devp2p.zerodao.com/tcp/443/wss/p2p-webrtc-star/",
    };
    return ZeroP2P;
}(Libp2p));
exports.ZeroP2P = ZeroP2P;
//# sourceMappingURL=zerop2p.js.map