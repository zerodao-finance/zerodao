"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.__esModule = true;
var ethers_1 = require("ethers");
require("chai");
var hre = require("hardhat");
var deployments = hre.deployments;
var _a = require("../"), UnderwriterTransferRequest = _a.UnderwriterTransferRequest, UnderwriterBurnRequest = _a.UnderwriterBurnRequest;
var enableGlobalMockRuntime = require("../dist/lib/mock").enableGlobalMockRuntime;
require("@0x/utils");
var badger = require("../lib/badger");
var deployParameters = require("../lib/fixtures");
var deploymentUtils = require("../dist/lib/deployment-utils");
enableGlobalMockRuntime();
var produceTestSignature = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ethers_1.ethers.Wallet.createRandom().signMessage("test")];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
UnderwriterTransferRequest.prototype.waitForSignature = function () {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                case 1:
                    _b.sent();
                    _a = {
                        //@ts-ignore
                        amount: ethers_1.ethers.BigNumber.from(this.amount)
                            .sub(ethers_1.ethers.utils.parseUnits("0.0015", 8))
                            .toString(),
                        //@ts-ignore
                        nHash: ethers_1.ethers.utils.hexlify(ethers_1.ethers.utils.randomBytes(32))
                    };
                    return [4 /*yield*/, produceTestSignature()];
                case 2: return [2 /*return*/, (
                    //@ts-ignore
                    _a.signature = _b.sent(),
                        _a)];
            }
        });
    });
};
var getRepl = function (o) { return __awaiter(void 0, void 0, void 0, function () {
    var r;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                r = require("repl").start("> ");
                Object.assign(r.context, o || {});
                return [4 /*yield*/, new Promise(function () { })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var getContractName = function () {
    switch (process.env.CHAIN) {
        default:
            return "RenZECController";
    }
};
var getController = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, hre.ethers.getContract(getContractName())];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var signETH = function (signer, params) {
    if (params === void 0) { params = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, contractAddress, amount, destination, minOut, contract;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = this, data = _a.data, contractAddress = _a.contractAddress, amount = _a.amount, destination = _a.destination;
                    minOut = "1";
                    if (data && data.length > 2)
                        minOut = ethers_1.ethers.utils.defaultAbiCoder.decode(["uint256"], data)[0];
                    contract = new ethers_1.ethers.Contract(contractAddress, ["function burnETH(uint256, bytes) payable"], signer);
                    return [4 /*yield*/, contract.burnETH(minOut, destination, __assign({ value: amount }, params))];
                case 1: return [2 /*return*/, _b.sent()];
            }
        });
    });
};
var toEIP712USDC = function (asset) {
    return function (contractAddress, chainId) {
        this.contractAddress = contractAddress || this.contractAddress;
        this.chainId = chainId || this.chainId;
        this.asset = asset;
        var params = {
            types: {
                Permit: [
                    {
                        name: "owner",
                        type: "address"
                    },
                    {
                        name: "spender",
                        type: "address"
                    },
                    {
                        name: "value",
                        type: "uint256"
                    },
                    {
                        name: "nonce",
                        type: "uint256"
                    },
                    {
                        name: "deadline",
                        type: "uint256"
                    },
                ]
            },
            domain: process.env.CHAIN == "MATIC"
                ? {
                    name: "USD Coin (PoS)",
                    version: "1",
                    verifyingContract: asset || ethers_1.ethers.constants.AddressZero,
                    salt: ethers_1.ethers.utils.hexZeroPad(ethers_1.ethers.BigNumber.from(String(this.chainId) || "1").toHexString(), 32)
                }
                : {
                    name: process.env.CHAIN == "ARBITRUM"
                        ? "USD Coin (Arb1)"
                        : "USD Coin",
                    version: process.env.CHAIN == "ETHEREUM" ? "2" : "1",
                    chainId: String(this.chainId) || "1",
                    verifyingContract: asset || ethers_1.ethers.constants.AddressZero
                },
            message: {
                owner: this.owner,
                spender: contractAddress,
                nonce: this.tokenNonce,
                deadline: this.getExpiry(),
                value: this.amount
            },
            primaryType: "Permit"
        };
        return params;
    };
};
describe("ZEC Controller", function () {
    before(function () { return __awaiter(void 0, void 0, void 0, function () {
        var signer, artifact, gateway, _a, _b, _c, renbtc;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, deployments.fixture()];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, hre.ethers.getSigners()];
                case 2:
                    signer = (_d.sent())[0];
                    return [4 /*yield*/, deployments.getArtifact("MockGatewayLogicV1")];
                case 3:
                    artifact = _d.sent();
                    //@ts-ignore
                    return [4 /*yield*/, hre.network.provider.send("hardhat_setCode", [
                            //@ts-ignore
                            ethers_1.utils.getAddress(deployParameters[process.env.CHAIN].zecGateway),
                            artifact.deployedBytecode,
                        ])];
                case 4:
                    //@ts-ignore
                    _d.sent();
                    gateway = new hre.ethers.Contract(deployParameters[process.env.CHAIN].zecGateway, [
                        "function mint(bytes32, uint256, bytes32, bytes) returns (uint256)",
                        "function mintFee() view returns (uint256)",
                    ], signer);
                    _b = (_a = gateway).mint;
                    _c = [ethers_1.utils.randomBytes(32),
                        ethers_1.utils.parseUnits("50", 8),
                        ethers_1.utils.randomBytes(32)];
                    return [4 /*yield*/, produceTestSignature()];
                case 5: return [4 /*yield*/, _b.apply(_a, _c.concat([_d.sent()]))];
                case 6:
                    _d.sent(); //mint renBTC to signer
                    renbtc = new hre.ethers.Contract(deployParameters[process.env.CHAIN].renZEC, ["function approve(address, uint256)"], signer);
                    console.log("minted renZEC to signer");
                    return [4 /*yield*/, hre.network.provider.send("hardhat_impersonateAccount", [
                            "0xcf7346a5e41b0821b80d5b3fdc385eeb6dc59f44",
                        ])];
                case 7:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("should do a transfer of renzec", function () { return __awaiter(void 0, void 0, void 0, function () {
        var contractAddress, signer, chainId, transferRequest, _a, tx, _b, _c, _d;
        var _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, getController()];
                case 1:
                    contractAddress = (_f.sent()).address;
                    deploymentUtils.CONTROLLER_DEPLOYMENTS.Ethereum = contractAddress;
                    return [4 /*yield*/, hre.ethers.getSigners()];
                case 2:
                    signer = (_f.sent())[0];
                    return [4 /*yield*/, signer.provider.getNetwork()];
                case 3:
                    chainId = (_f.sent()).chainId;
                    console.log(chainId);
                    _a = UnderwriterTransferRequest.bind;
                    _e = {
                        contractAddress: contractAddress,
                        nonce: ethers_1.utils.hexlify(ethers_1.utils.randomBytes(32))
                    };
                    return [4 /*yield*/, signer.getAddress()];
                case 4:
                    transferRequest = new (_a.apply(UnderwriterTransferRequest, [void 0, (_e.to = _f.sent(),
                            _e.pNonce = ethers_1.utils.hexlify(ethers_1.utils.randomBytes(32)),
                            _e.module = deployParameters[process.env.CHAIN].renZEC,
                            _e.amount = ethers_1.utils.hexlify(ethers_1.utils.parseUnits("0.005", 8)),
                            _e.asset = deployParameters[process.env.CHAIN].WBTC,
                            _e.chainId = chainId,
                            _e.data = ethers_1.utils.defaultAbiCoder.encode(["uint256"], ["1"]),
                            _e.underwriter = contractAddress,
                            _e)]))();
                    transferRequest.requestType = "TRANSFER";
                    return [4 /*yield*/, transferRequest.sign(signer)];
                case 5:
                    _f.sent();
                    console.log("signed", transferRequest.signature);
                    return [4 /*yield*/, transferRequest.repay(signer)];
                case 6:
                    tx = _f.sent();
                    _c = (_b = console).log;
                    _d = ["Gas Used:"];
                    return [4 /*yield*/, tx.wait()];
                case 7:
                    _c.apply(_b, _d.concat([(_f.sent()).gasUsed.toString()]));
                    return [2 /*return*/];
            }
        });
    }); });
    it("should do a renzec burn", function () { return __awaiter(void 0, void 0, void 0, function () {
        var contractAddress, signer, chainId, transferRequest, _a, sign, toEIP712, tx, _b, _c, _d;
        var _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, getController()];
                case 1:
                    contractAddress = (_f.sent()).address;
                    deploymentUtils.CONTROLLER_DEPLOYMENTS.Ethereum = contractAddress;
                    return [4 /*yield*/, hre.ethers.getSigners()];
                case 2:
                    signer = (_f.sent())[0];
                    return [4 /*yield*/, signer.provider.getNetwork()];
                case 3:
                    chainId = (_f.sent()).chainId;
                    console.log(chainId);
                    _a = UnderwriterBurnRequest.bind;
                    _e = {
                        contractAddress: contractAddress
                    };
                    return [4 /*yield*/, signer.getAddress()];
                case 4:
                    transferRequest = new (_a.apply(UnderwriterBurnRequest, [void 0, (_e.owner = _f.sent(),
                            _e.amount = ethers_1.utils.hexlify(ethers_1.utils.parseUnits("0.005", 8)),
                            _e.asset = deployParameters[process.env.CHAIN].renZEC,
                            _e.chainId = chainId,
                            _e.underwriter = contractAddress,
                            _e.deadline = Math.floor((+new Date() + 1000 * 60 * 60 * 24) / 1000),
                            _e.destination = ethers_1.utils.hexlify(ethers_1.utils.randomBytes(64)),
                            _e.data = ethers_1.utils.defaultAbiCoder.encode(["uint256"], ["1"]),
                            _e)]))();
                    console.log(transferRequest);
                    sign = transferRequest.sign, toEIP712 = transferRequest.toEIP712;
                    transferRequest.requestType = "BURN";
                    return [4 /*yield*/, transferRequest.sign(signer, contractAddress)];
                case 5:
                    _f.sent();
                    console.log("signed", transferRequest.signature);
                    return [4 /*yield*/, transferRequest.burn(signer)];
                case 6:
                    tx = _f.sent();
                    _c = (_b = console).log;
                    _d = ["Gas Used:"];
                    return [4 /*yield*/, tx.wait()];
                case 7:
                    _c.apply(_b, _d.concat([(_f.sent()).gasUsed.toString()]));
                    return [2 /*return*/];
            }
        });
    }); });
    it("should do a transfer of eth", function () { return __awaiter(void 0, void 0, void 0, function () {
        var contractAddress, signer, chainId, transferRequest, _a, tx, _b, _c, _d;
        var _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, getController()];
                case 1:
                    contractAddress = (_f.sent()).address;
                    deploymentUtils.CONTROLLER_DEPLOYMENTS.Ethereum = contractAddress;
                    return [4 /*yield*/, hre.ethers.getSigners()];
                case 2:
                    signer = (_f.sent())[0];
                    return [4 /*yield*/, signer.provider.getNetwork()];
                case 3:
                    chainId = (_f.sent()).chainId;
                    _a = UnderwriterTransferRequest.bind;
                    _e = {
                        contractAddress: contractAddress,
                        nonce: ethers_1.utils.hexlify(ethers_1.utils.randomBytes(32))
                    };
                    return [4 /*yield*/, signer.getAddress()];
                case 4:
                    transferRequest = new (_a.apply(UnderwriterTransferRequest, [void 0, (_e.to = _f.sent(),
                            _e.pNonce = ethers_1.utils.hexlify(ethers_1.utils.randomBytes(32)),
                            _e.module = ethers_1.ethers.constants.AddressZero,
                            _e.amount = ethers_1.utils.hexlify(ethers_1.utils.parseUnits("0.5", 8)),
                            _e.asset = deployParameters[process.env.CHAIN].WBTC,
                            _e.chainId = chainId,
                            _e.data = ethers_1.utils.defaultAbiCoder.encode(["uint256"], ["1"]),
                            _e.underwriter = contractAddress,
                            _e)]))();
                    transferRequest.requestType = "TRANSFER";
                    return [4 /*yield*/, transferRequest.sign(signer)];
                case 5:
                    _f.sent();
                    console.log("signed", transferRequest.signature);
                    return [4 /*yield*/, transferRequest.repay(signer)];
                case 6:
                    tx = _f.sent();
                    _c = (_b = console).log;
                    _d = ["Gas Used:"];
                    return [4 /*yield*/, tx.wait()];
                case 7:
                    _c.apply(_b, _d.concat([(_f.sent()).gasUsed.toString()]));
                    return [2 /*return*/];
            }
        });
    }); });
    it("should do a eth burn", function () { return __awaiter(void 0, void 0, void 0, function () {
        var contractAddress, signer, chainId, transferRequest, _a, tx, _b, _c, _d;
        var _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, getController()];
                case 1:
                    contractAddress = (_f.sent()).address;
                    deploymentUtils.CONTROLLER_DEPLOYMENTS.Ethereum = contractAddress;
                    return [4 /*yield*/, hre.ethers.getSigners()];
                case 2:
                    signer = (_f.sent())[0];
                    return [4 /*yield*/, signer.provider.getNetwork()];
                case 3:
                    chainId = (_f.sent()).chainId;
                    _a = UnderwriterBurnRequest.bind;
                    _e = {
                        contractAddress: contractAddress
                    };
                    return [4 /*yield*/, signer.getAddress()];
                case 4:
                    transferRequest = new (_a.apply(UnderwriterBurnRequest, [void 0, (_e.owner = _f.sent(),
                            _e.amount = ethers_1.utils.hexlify(ethers_1.utils.parseUnits("1", 18)),
                            _e.asset = ethers_1.ethers.constants.AddressZero,
                            _e.chainId = chainId,
                            _e.underwriter = contractAddress,
                            _e.deadline = Math.floor((+new Date() + 1000 * 60 * 60 * 24) / 1000),
                            _e.destination = ethers_1.ethers.utils.hexlify(ethers_1.utils.randomBytes(64)).toString(),
                            _e.data = ethers_1.utils.defaultAbiCoder.encode(["uint256"], ["1"]),
                            _e)]))();
                    console.log(transferRequest.data);
                    transferRequest.sign = signETH;
                    transferRequest.requestType = "BURN";
                    return [4 /*yield*/, transferRequest.sign(signer)];
                case 5:
                    tx = _f.sent();
                    _c = (_b = console).log;
                    _d = ["Gas Used:"];
                    return [4 /*yield*/, tx.wait()];
                case 6:
                    _c.apply(_b, _d.concat([(_f.sent()).gasUsed.toString()]));
                    return [2 /*return*/];
            }
        });
    }); });
    it("should do a transfer of usdt", function () { return __awaiter(void 0, void 0, void 0, function () {
        var contractAddress, signer, chainId, transferRequest, _a, tx, usdt, _b, _c, _d, _e, _f, _g, _h;
        var _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0: return [4 /*yield*/, getController()];
                case 1:
                    contractAddress = (_k.sent()).address;
                    deploymentUtils.CONTROLLER_DEPLOYMENTS.Ethereum = contractAddress;
                    return [4 /*yield*/, hre.ethers.getSigners()];
                case 2:
                    signer = (_k.sent())[0];
                    return [4 /*yield*/, signer.provider.getNetwork()];
                case 3:
                    chainId = (_k.sent()).chainId;
                    console.log(chainId);
                    _a = UnderwriterTransferRequest.bind;
                    _j = {
                        contractAddress: contractAddress,
                        nonce: ethers_1.utils.hexlify(ethers_1.utils.randomBytes(32))
                    };
                    return [4 /*yield*/, signer.getAddress()];
                case 4:
                    transferRequest = new (_a.apply(UnderwriterTransferRequest, [void 0, (_j.to = _k.sent(),
                            _j.pNonce = ethers_1.utils.hexlify(ethers_1.utils.randomBytes(32)),
                            _j.module = deployParameters[process.env.CHAIN].USDT,
                            _j.amount = ethers_1.utils.hexlify(ethers_1.utils.parseUnits("50", 8)),
                            _j.asset = deployParameters[process.env.CHAIN].USDT,
                            _j.chainId = chainId,
                            _j.data = ethers_1.utils.defaultAbiCoder.encode(["uint256"], ["1"]),
                            _j.underwriter = contractAddress,
                            _j)]))();
                    transferRequest.requestType = "TRANSFER";
                    return [4 /*yield*/, transferRequest.sign(signer)];
                case 5:
                    _k.sent();
                    console.log("signed", transferRequest.signature);
                    return [4 /*yield*/, transferRequest.repay(signer)];
                case 6:
                    tx = _k.sent();
                    usdt = new ethers_1.ethers.Contract(deployParameters[process.env.CHAIN].USDT, [
                        "function approve(address, uint256)",
                        "function balanceOf(address) view returns (uint256)",
                    ], signer);
                    _c = (_b = console).log;
                    _e = (_d = usdt).balanceOf;
                    return [4 /*yield*/, signer.getAddress()];
                case 7: return [4 /*yield*/, _e.apply(_d, [_k.sent()])];
                case 8:
                    _c.apply(_b, [_k.sent()]);
                    _g = (_f = console).log;
                    _h = ["Gas Used:"];
                    return [4 /*yield*/, tx.wait()];
                case 9:
                    _g.apply(_f, _h.concat([(_k.sent()).gasUsed.toString()]));
                    return [2 /*return*/];
            }
        });
    }); });
    it("should do a usdt burn", function () { return __awaiter(void 0, void 0, void 0, function () {
        var contractAddress, signer, chainId, usdt, _a, _b, _c, _d, transferRequest, _e, sign, toEIP712, tx, _f, _g, _h;
        var _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0: return [4 /*yield*/, getController()];
                case 1:
                    contractAddress = (_k.sent()).address;
                    deploymentUtils.CONTROLLER_DEPLOYMENTS.Ethereum = contractAddress;
                    return [4 /*yield*/, hre.ethers.getSigners()];
                case 2:
                    signer = (_k.sent())[0];
                    return [4 /*yield*/, signer.provider.getNetwork()];
                case 3:
                    chainId = (_k.sent()).chainId;
                    usdt = new ethers_1.ethers.Contract(deployParameters[process.env.CHAIN].USDT, [
                        "function approve(address, uint256)",
                        "function balanceOf(address) view returns (uint256)",
                    ], signer);
                    _b = (_a = console).log;
                    _d = (_c = usdt).balanceOf;
                    return [4 /*yield*/, signer.getAddress()];
                case 4: return [4 /*yield*/, _d.apply(_c, [_k.sent()])];
                case 5:
                    _b.apply(_a, [_k.sent()]);
                    _e = UnderwriterBurnRequest.bind;
                    _j = {
                        contractAddress: contractAddress
                    };
                    return [4 /*yield*/, signer.getAddress()];
                case 6:
                    transferRequest = new (_e.apply(UnderwriterBurnRequest, [void 0, (_j.owner = _k.sent(),
                            _j.amount = ethers_1.utils.hexlify(ethers_1.utils.parseUnits("100", 6)),
                            _j.asset = deployParameters[process.env.CHAIN].USDT,
                            _j.chainId = chainId,
                            _j.underwriter = contractAddress,
                            _j.deadline = Math.floor((+new Date() + 1000 * 60 * 60 * 24) / 1000),
                            _j.destination = ethers_1.utils.hexlify(ethers_1.utils.randomBytes(64)),
                            _j.data = ethers_1.utils.defaultAbiCoder.encode(["uint256"], ["1"]),
                            _j)]))();
                    console.log(transferRequest);
                    sign = transferRequest.sign, toEIP712 = transferRequest.toEIP712;
                    transferRequest.sign = function (signer, contractAddress) {
                        return __awaiter(this, void 0, void 0, function () {
                            var asset, tokenNonce, _a, _b, _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        asset = this.asset;
                                        this.asset = deployParameters[process.env.CHAIN].renBTC;
                                        _a = String;
                                        _c = (_b = new ethers_1.ethers.Contract(this.contractAddress, ["function noncesUsdt(address) view returns (uint256) "], signer)).noncesUsdt;
                                        return [4 /*yield*/, signer.getAddress()];
                                    case 1: return [4 /*yield*/, _c.apply(_b, [_d.sent()])];
                                    case 2:
                                        tokenNonce = _a.apply(void 0, [_d.sent()]);
                                        this.contractAddress = contractAddress;
                                        transferRequest.toEIP712 = function () {
                                            var args = [];
                                            for (var _i = 0; _i < arguments.length; _i++) {
                                                args[_i] = arguments[_i];
                                            }
                                            this.asset = asset;
                                            this.tokenNonce = tokenNonce;
                                            this.assetName = "USDT";
                                            return toEIP712.apply(this, args);
                                        };
                                        return [4 /*yield*/, sign.call(this, signer, contractAddress)];
                                    case 3: return [2 /*return*/, _d.sent()];
                                }
                            });
                        });
                    };
                    transferRequest.requestType = "BURN";
                    return [4 /*yield*/, transferRequest.sign(signer, contractAddress)];
                case 7:
                    _k.sent();
                    console.log("signed", transferRequest.signature);
                    return [4 /*yield*/, usdt.approve(transferRequest.contractAddress, ethers_1.ethers.constants.MaxUint256)];
                case 8:
                    _k.sent();
                    return [4 /*yield*/, transferRequest.burn(signer)];
                case 9:
                    tx = _k.sent();
                    _g = (_f = console).log;
                    _h = ["Gas Used:"];
                    return [4 /*yield*/, tx.wait()];
                case 10:
                    _g.apply(_f, _h.concat([(_k.sent()).gasUsed.toString()]));
                    return [2 /*return*/];
            }
        });
    }); });
    it("should do a transfer of usdc", function () { return __awaiter(void 0, void 0, void 0, function () {
        var contractAddress, signer, chainId, usdc, transferRequest, _a, tx, _b, _c, _d, _e, _f, _g, _h;
        var _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0: return [4 /*yield*/, getController()];
                case 1:
                    contractAddress = (_k.sent()).address;
                    deploymentUtils.CONTROLLER_DEPLOYMENTS.Ethereum = contractAddress;
                    return [4 /*yield*/, hre.ethers.getSigners()];
                case 2:
                    signer = (_k.sent())[0];
                    return [4 /*yield*/, signer.provider.getNetwork()];
                case 3:
                    chainId = (_k.sent()).chainId;
                    usdc = new hre.ethers.Contract(deployParameters[process.env.CHAIN].USDC, ["function balanceOf(address owner) view returns (uint256)"], signer);
                    _a = UnderwriterTransferRequest.bind;
                    _j = {
                        contractAddress: contractAddress,
                        nonce: ethers_1.utils.hexlify(ethers_1.utils.randomBytes(32))
                    };
                    return [4 /*yield*/, signer.getAddress()];
                case 4:
                    transferRequest = new (_a.apply(UnderwriterTransferRequest, [void 0, (_j.to = _k.sent(),
                            _j.pNonce = ethers_1.utils.hexlify(ethers_1.utils.randomBytes(32)),
                            _j.module = deployParameters[process.env.CHAIN].USDC,
                            _j.amount = ethers_1.utils.hexlify(ethers_1.utils.parseUnits("50", 8)),
                            _j.asset = deployParameters[process.env.CHAIN].USDC,
                            _j.chainId = chainId,
                            _j.data = ethers_1.utils.defaultAbiCoder.encode(["uint256"], ["1"]),
                            _j.underwriter = contractAddress,
                            _j)]))();
                    transferRequest.requestType = "TRANSFER";
                    return [4 /*yield*/, transferRequest.sign(signer)];
                case 5:
                    _k.sent();
                    console.log("signed", transferRequest.signature);
                    return [4 /*yield*/, transferRequest.repay(signer)];
                case 6:
                    tx = _k.sent();
                    _c = (_b = console).log;
                    _e = (_d = usdc).balanceOf;
                    return [4 /*yield*/, signer.getAddress()];
                case 7: return [4 /*yield*/, _e.apply(_d, [_k.sent()])];
                case 8:
                    _c.apply(_b, [_k.sent()]);
                    _g = (_f = console).log;
                    _h = ["Gas Used:"];
                    return [4 /*yield*/, tx.wait()];
                case 9:
                    _g.apply(_f, _h.concat([(_k.sent()).gasUsed.toString()]));
                    return [2 /*return*/];
            }
        });
    }); });
    it("should do a usdc burn", function () { return __awaiter(void 0, void 0, void 0, function () {
        var contractAddress, signer, chainId, usdc, transferRequest, _a, sign, toEIP712, tx, _b, _c, _d;
        var _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, getController()];
                case 1:
                    contractAddress = (_f.sent()).address;
                    deploymentUtils.CONTROLLER_DEPLOYMENTS.Ethereum = contractAddress;
                    return [4 /*yield*/, hre.ethers.getSigners()];
                case 2:
                    signer = (_f.sent())[0];
                    return [4 /*yield*/, signer.provider.getNetwork()];
                case 3:
                    chainId = (_f.sent()).chainId;
                    console.log(chainId);
                    usdc = new ethers_1.ethers.Contract(deployParameters[process.env.CHAIN].USDC, [
                        "function approve(address, uint256)",
                        "function balanceOf(address) view returns (uint256)",
                    ], signer);
                    _a = UnderwriterBurnRequest.bind;
                    _e = {
                        contractAddress: contractAddress
                    };
                    return [4 /*yield*/, signer.getAddress()];
                case 4:
                    transferRequest = new (_a.apply(UnderwriterBurnRequest, [void 0, (_e.owner = _f.sent(),
                            _e.amount = ethers_1.utils.hexlify(ethers_1.utils.parseUnits("100", 6)),
                            _e.asset = deployParameters[process.env.CHAIN].USDC,
                            _e.chainId = chainId,
                            _e.underwriter = contractAddress,
                            _e.deadline = Math.floor((+new Date() + 1000 * 60 * 60 * 24) / 1000),
                            _e.destination = ethers_1.utils.hexlify(ethers_1.utils.randomBytes(64)),
                            _e.data = ethers_1.utils.defaultAbiCoder.encode(["uint256"], ["1"]),
                            _e)]))();
                    sign = transferRequest.sign, toEIP712 = transferRequest.toEIP712;
                    return [4 /*yield*/, usdc.approve(contractAddress, transferRequest.amount)];
                case 5:
                    _f.sent();
                    transferRequest.toEIP712 = toEIP712USDC(transferRequest.asset);
                    transferRequest.requestType = "BURN";
                    return [4 /*yield*/, transferRequest.sign(signer, contractAddress)];
                case 6:
                    _f.sent();
                    console.log("signed", transferRequest.signature);
                    return [4 /*yield*/, transferRequest.burn(signer)];
                case 7:
                    tx = _f.sent();
                    _c = (_b = console).log;
                    _d = ["Gas Used:"];
                    return [4 /*yield*/, tx.wait()];
                case 8:
                    _c.apply(_b, _d.concat([(_f.sent()).gasUsed.toString()]));
                    return [2 /*return*/];
            }
        });
    }); });
    it("should test burnApproved", function () { return __awaiter(void 0, void 0, void 0, function () {
        var contractAddress, signer, chainId, Dummy, _a, _b, _c, renbtc, transferRequest, _d, tx, burnRequest, _e, dummy, _f, _g, _h;
        var _j, _k, _l;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0: return [4 /*yield*/, getController()];
                case 1:
                    contractAddress = (_m.sent()).address;
                    deploymentUtils.CONTROLLER_DEPLOYMENTS.Ethereum = contractAddress;
                    return [4 /*yield*/, hre.ethers.getSigners()];
                case 2:
                    signer = (_m.sent())[0];
                    return [4 /*yield*/, signer.provider.getNetwork()];
                case 3:
                    chainId = (_m.sent()).chainId;
                    _b = (_a = hre.deployments).deploy;
                    _c = ["DummyBurnCaller"];
                    _j = {};
                    return [4 /*yield*/, signer.getAddress()];
                case 4: return [4 /*yield*/, _b.apply(_a, _c.concat([(_j.from = _m.sent(),
                            _j.args = [contractAddress, deployParameters[process.env.CHAIN].renZEC],
                            _j)]))];
                case 5:
                    Dummy = _m.sent();
                    renbtc = new ethers_1.ethers.Contract(deployParameters[process.env.CHAIN].renZEC, ["function transfer(address, uint256)"], signer);
                    return [4 /*yield*/, renbtc.transfer(Dummy.receipt.contractAddress, ethers_1.utils.hexlify(ethers_1.utils.parseUnits("0.1", 8)))];
                case 6:
                    _m.sent();
                    _d = UnderwriterTransferRequest.bind;
                    _k = {
                        contractAddress: contractAddress,
                        nonce: ethers_1.utils.hexlify(ethers_1.utils.randomBytes(32))
                    };
                    return [4 /*yield*/, signer.getAddress()];
                case 7:
                    transferRequest = new (_d.apply(UnderwriterTransferRequest, [void 0, (_k.to = _m.sent(),
                            _k.pNonce = ethers_1.utils.hexlify(ethers_1.utils.randomBytes(32)),
                            _k.module = deployParameters[process.env.CHAIN].renZEC,
                            _k.amount = ethers_1.utils.hexlify(ethers_1.utils.parseUnits("0.1", 8)),
                            _k.asset = deployParameters[process.env.CHAIN].WBTC,
                            _k.chainId = chainId,
                            _k.data = ethers_1.utils.defaultAbiCoder.encode(["uint256"], ["1"]),
                            _k.underwriter = contractAddress,
                            _k)]))();
                    transferRequest.requestType = "TRANSFER";
                    return [4 /*yield*/, transferRequest.sign(signer)];
                case 8:
                    _m.sent();
                    console.log("signed", transferRequest.signature);
                    return [4 /*yield*/, transferRequest.repay(signer)];
                case 9:
                    tx = _m.sent();
                    _e = UnderwriterBurnRequest.bind;
                    _l = {
                        contractAddress: Dummy.receipt.contractAddress
                    };
                    return [4 /*yield*/, signer.getAddress()];
                case 10:
                    burnRequest = new (_e.apply(UnderwriterBurnRequest, [void 0, (_l.owner = _m.sent(),
                            _l.amount = ethers_1.utils.hexlify(ethers_1.utils.parseUnits("0.1", 8)),
                            _l.asset = deployParameters[process.env.CHAIN].renZEC,
                            _l.chainId = chainId,
                            _l.underwriter = contractAddress,
                            _l.deadline = Math.floor((+new Date() + 1000 * 60 * 60 * 24) / 1000),
                            _l.destination = ethers_1.utils.hexlify(ethers_1.utils.randomBytes(64)),
                            _l.data = ethers_1.utils.defaultAbiCoder.encode(["uint256"], ["1"]),
                            _l)]))();
                    transferRequest.requestType = "BURN";
                    return [4 /*yield*/, burnRequest.sign(signer, Dummy.receipt.contractAddress)];
                case 11:
                    _m.sent();
                    dummy = new ethers_1.ethers.Contract(Dummy.receipt.contractAddress, Dummy.abi, signer);
                    _g = (_f = dummy).callBurn;
                    _h = [contractAddress];
                    return [4 /*yield*/, signer.getAddress()];
                case 12: return [4 /*yield*/, _g.apply(_f, _h.concat([_m.sent(), burnRequest.asset,
                        burnRequest.amount,
                        burnRequest.getExpiry(),
                        burnRequest.signature,
                        burnRequest.destination]))];
                case 13:
                    _m.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("should test earn", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getController()];
                case 1: return [4 /*yield*/, (_a.sent()).earn()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
