"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.utils = exports.DEPLOYMENTS = exports.ZeroP2P = exports.makeCompute = exports.makeQuoter = exports.ID_CHAIN = exports.NAME_CHAIN = exports.CHAINS = exports.URLS = exports.CONTROLLER_DEPLOYMENTS = exports.RPC_ENDPOINTS = exports.RENVM_PROVIDERS = exports.FIXTURES = void 0;
var common_1 = require("@zerodao/common");
Object.defineProperty(exports, "FIXTURES", { enumerable: true, get: function () { return common_1.FIXTURES; } });
__exportStar(require("@zerodao/request"), exports);
var chains_1 = require("@zerodao/chains");
Object.defineProperty(exports, "RENVM_PROVIDERS", { enumerable: true, get: function () { return chains_1.RENVM_PROVIDERS; } });
Object.defineProperty(exports, "RPC_ENDPOINTS", { enumerable: true, get: function () { return chains_1.RPC_ENDPOINTS; } });
Object.defineProperty(exports, "CONTROLLER_DEPLOYMENTS", { enumerable: true, get: function () { return chains_1.CONTROLLER_DEPLOYMENTS; } });
Object.defineProperty(exports, "URLS", { enumerable: true, get: function () { return chains_1.URLS; } });
Object.defineProperty(exports, "CHAINS", { enumerable: true, get: function () { return chains_1.CHAINS; } });
Object.defineProperty(exports, "NAME_CHAIN", { enumerable: true, get: function () { return chains_1.NAME_CHAIN; } });
Object.defineProperty(exports, "ID_CHAIN", { enumerable: true, get: function () { return chains_1.ID_CHAIN; } });
var compute_1 = require("@zerodao/compute");
Object.defineProperty(exports, "makeQuoter", { enumerable: true, get: function () { return compute_1.makeQuoter; } });
Object.defineProperty(exports, "makeCompute", { enumerable: true, get: function () { return compute_1.makeCompute; } });
const compute_2 = require("@zerodao/compute");
__exportStar(require("@zerodao/logger"), exports);
var p2p_1 = require("@zerodao/p2p");
Object.defineProperty(exports, "ZeroP2P", { enumerable: true, get: function () { return p2p_1.ZeroP2P; } });
const utilsModule = __importStar(require("@zerodao/utils"));
const deployments = require("@zerodao/protocol");
exports.DEPLOYMENTS = deployments;
const utils = Object.assign({
    applyRatio: compute_2.applyRatio,
    computeRandomValue: compute_2.computeRandomValue,
    getNonce: compute_2.getNonce,
    getPNonce: compute_2.getPNonce
}, utilsModule);
exports.utils = utils;
//# sourceMappingURL=index.js.map