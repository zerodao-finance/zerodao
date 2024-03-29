"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BurnRequest = exports.getRenAsset = void 0;
const abi_1 = require("@ethersproject/abi");
const contracts_1 = require("@ethersproject/contracts");
const constants_1 = require("@ethersproject/constants");
const solidity_1 = require("@ethersproject/solidity");
const bytes_1 = require("@ethersproject/bytes");
const address_1 = require("@ethersproject/address");
const basex_1 = require("@ethersproject/basex");
const bignumber_1 = require("@ethersproject/bignumber");
const BTCHandler_1 = require("send-crypto/build/main/handlers/BTC/BTCHandler");
const ZECHandler_1 = require("send-crypto/build/main/handlers/ZEC/ZECHandler");
const common_1 = require("@zerodao/common");
//import type { ZeroP2P } from "@zerodao/p2p";
const chains_1 = require("@zerodao/chains");
const Request_1 = require("./Request");
const ethers_1 = require("ethers");
const querystring_1 = __importDefault(require("querystring"));
const url_1 = __importDefault(require("url"));
const coder = new abi_1.AbiCoder();
const remoteTxMap = new WeakMap();
function getDomainStructure(request) {
    return Number(request.getChainId()) == 137 &&
        (0, address_1.getAddress)(request.asset) === (0, address_1.getAddress)(common_1.FIXTURES.MATIC.USDC)
        ? [
            {
                name: "name",
                type: "string",
            },
            {
                name: "version",
                type: "string",
            },
            {
                name: "verifyingContract",
                type: "address",
            },
            {
                name: "salt",
                type: "bytes32",
            },
        ]
        : [
            {
                name: "name",
                type: "string",
            },
            {
                name: "version",
                type: "string",
            },
            {
                name: "chainId",
                type: "uint256",
            },
            {
                name: "verifyingContract",
                type: "address",
            },
        ];
}
function isAsset(assetName, address) {
    return Boolean(Object.keys(common_1.FIXTURES).find((network) => (0, address_1.getAddress)(common_1.FIXTURES[network][assetName] ||
        constants_1.AddressZero.substr(0, 41) + "1") === (0, address_1.getAddress)(address)));
}
function isUSDC(asset) {
    return isAsset("USDC", asset);
}
function isWBTC(asset) {
    return isAsset("WBTC", asset);
}
function getPermitStructure(request) {
    if (isUSDC(request.asset) && request.getChainId() !== 43114) {
        return [
            {
                name: "owner",
                type: "address",
            },
            {
                name: "spender",
                type: "address",
            },
            {
                name: "value",
                type: "uint256",
            },
            {
                name: "nonce",
                type: "uint256",
            },
            {
                name: "deadline",
                type: "uint256",
            },
        ];
    }
    return [
        {
            name: "holder",
            type: "address",
        },
        {
            name: "spender",
            type: "address",
        },
        {
            name: "nonce",
            type: "uint256",
        },
        {
            name: "expiry",
            type: "uint256",
        },
        {
            name: "allowed",
            type: "bool",
        },
    ];
}
function getDomain(request) {
    const chainId = request.getChainId();
    if (isUSDC(request.asset)) {
        if (chainId === 137) {
            return {
                name: "USD Coin (PoS)",
                version: "1",
                verifyingContract: request.asset || constants_1.AddressZero,
                salt: (0, bytes_1.hexZeroPad)(bignumber_1.BigNumber.from(String(chainId) || "1").toHexString(), 32),
            };
        }
        if (chainId === 42161) {
            return {
                name: "USD Coin (Arb1)",
                version: "1",
                chainId: String(chainId),
                verifyingContract: request.asset || constants_1.AddressZero,
            };
        }
        return {
            name: "USD Coin",
            version: chainId === 43114 ? "1" : "2",
            chainId: String(chainId),
            verifyingContract: request.asset,
        };
    }
    return {
        name: request.tokenName,
        version: "1",
        chainId: String(chainId),
        verifyingContract: request.asset,
    };
}
function getMessage(request) {
    if (isUSDC(request.asset) && request.getChainId() !== 43114) {
        return {
            owner: request.owner,
            spender: request.contractAddress,
            nonce: request.nonce,
            deadline: request.getExpiry(),
            value: request.amount,
        };
    }
    return {
        holder: request.owner,
        spender: request.contractAddress,
        nonce: request.nonce,
        expiry: request.getExpiry(),
        allowed: "true",
    };
}
function getRenAsset(request) {
    const provider = (0, chains_1.getVanillaProvider)(request);
    const address = common_1.FIXTURES[(0, common_1.toFixtureName)(request.getChainId())][(0, common_1.getRenAssetName)(request)];
    return new contracts_1.Contract(address, [
        "event Transfer(address indexed from, address indexed to, uint256 amount)",
    ], provider);
}
exports.getRenAsset = getRenAsset;
class BurnRequest extends Request_1.Request {
    static get PROTOCOL() {
        return "/zero/2.1.0/dispatch";
    }
    ;
    static get FIELDS() {
        return [
            'contractAddress',
            'owner',
            'asset',
            'amount',
            'deadline',
            'data',
            'destination',
            'signature'
        ];
    }
    ;
    static minOutFromData(data) {
        const [result] = coder.decode(["uint256"], data);
        return result;
    }
    ;
    static dataFromMinOut(minOut) {
        return coder.encode(['uint256'], [minOut]);
    }
    ;
    constructor(o) {
        super();
        this.asset = o.asset;
        this.data = o.data;
        this.owner = o.owner;
        this.destination = o.destination;
        this.deadline = o.deadline;
        this.amount = o.amount;
        this.contractAddress = o.contractAddress;
        this.signature = o.signature;
    }
    async sendTransaction(signer) {
        const mint = await (await fetch(url_1.default.format({
            hostname: 'thornode.thorchain.liquify.com',
            pathname: '/thorchain/quote/swap',
            search: '?' + querystring_1.default.stringify({ amount: bignumber_1.BigNumber.from(this.amount).toString(), from_asset: 'ETH.ETH', to_asset: 'BTC.BTC', destination: this.getNormalizedDestinationAddress() })
        }))).json();
        const tx = await signer.sendTransaction({
            to: mint.inbound_address,
            data: '0x' + Buffer.from('=:BTC.BTC:' + this.getNormalizedDestinationAddress()).toString('hex'),
            value: this.amount
        });
        remoteTxMap.set(this, tx.wait());
        return tx;
    }
    ;
    hash() {
        return ethers_1.ethers.utils.keccak256(this.serialize());
    }
    isNative() {
        return this.asset === constants_1.AddressZero;
    }
    ;
    toEIP712() {
        return {
            types: {
                EIP712Domain: getDomainStructure(this),
                Permit: getPermitStructure(this),
            },
            primaryType: "Permit",
            domain: getDomain(this),
            message: getMessage(this),
        };
    }
    ;
    getExpiry() {
        return (0, solidity_1.keccak256)(["address", "uint256", "uint256", "uint256", "bytes", "bytes"], [
            this.asset,
            this.amount,
            this.deadline,
            this.nonce,
            this.data,
            this.destination,
        ]);
    }
    ;
    async waitForHostTransaction() {
        const receiptPromise = remoteTxMap.get(this);
        if (receiptPromise)
            return await receiptPromise;
        return await new Promise((resolve, reject) => {
            const renAsset = getRenAsset(this);
            const filter = renAsset.filters.Transfer(this.contractAddress, constants_1.AddressZero);
            const done = (rcpt) => {
                renAsset.off(filter, listener);
                resolve(rcpt);
            };
            const listener = (from, to, amount, evt) => {
                (async () => {
                    if (this.asset == constants_1.AddressZero) {
                        const tx = await evt.getTransaction();
                        if (tx.from === this.owner &&
                            (0, bytes_1.hexlify)(tx.value) === (0, bytes_1.hexlify)(this.amount))
                            return done(await evt.getTransactionReceipt());
                    }
                    else {
                        const receipt = await evt.getTransactionReceipt();
                        const { logs } = await evt.getTransactionReceipt();
                        const decoded = logs
                            .map((v) => {
                            try {
                                return renAsset.interface.parseLog(v);
                            }
                            catch (e) {
                                console.error(e);
                            }
                        })
                            .filter(Boolean);
                        const events = logs.map((v, i) => ({ log: v, event: decoded[i] }));
                        console.log("events", events);
                        if (events.find((v) => v.event.args.from.toLowerCase() ===
                            this.owner.toLowerCase() &&
                            (0, bytes_1.hexlify)(this.amount) ===
                                (0, bytes_1.hexlify)((v.event.args && v.event.args.amount) || 0)))
                            return done(receipt);
                    }
                })().catch((err) => console.error(err));
            };
            renAsset.on(filter, listener);
        });
    }
    ;
    supportsERC20Permit() {
        return !(isUSDC(this.asset) && this.getChainId() === 43114 || isWBTC(this.asset) || this.getChainId() === 1 && (0, address_1.getAddress)(common_1.FIXTURES.ETHEREUM.USDT) === (0, address_1.getAddress)(this.asset));
    }
    ;
    async needsApproval() {
        const contract = new contracts_1.Contract(this.asset, ['function allowance(address, address) view returns (uint256)'], (0, chains_1.getVanillaProvider)(this));
        return (await contract.allowance(this.owner, this.contractAddress)).lt(this.amount);
    }
    ;
    async approve(signer, amount) {
        if (!amount)
            amount = constants_1.MaxUint256;
        const contract = new contracts_1.Contract(this.asset, ['function approve(address, uint256) returns (bool)'], signer);
        return await contract.approve(this.contractAddress, amount);
    }
    ;
    getHandlerForDestinationChain() {
        return (0, common_1.isZcashAddress)(this.destination) ? ZECHandler_1.ZECHandler : BTCHandler_1.BTCHandler;
    }
    ;
    getNormalizedDestinationAddress() {
        if ((0, common_1.isZcashAddress)(this.destination))
            return Buffer.from((0, bytes_1.hexlify)(this.destination).substr(2), "hex").toString("utf8"); // implement zcash encoding here
        const arrayed = Array.from((0, bytes_1.arrayify)(this.destination));
        let address;
        if (arrayed.length > 40)
            address = Buffer.from(arrayed).toString("utf8");
        else
            address = basex_1.Base58.encode(this.destination);
        return address;
    }
    ;
    async waitForRemoteTransaction() {
        const { length } = await this.getHandlerForDestinationChain().getUTXOs(false, {
            address: this.getNormalizedDestinationAddress(),
            confirmations: 0,
        });
        while (true) {
            try {
                const utxos = await this.getHandlerForDestinationChain().getUTXOs(false, {
                    address: this.getNormalizedDestinationAddress(),
                    confirmations: 0,
                });
                if (utxos.length > length)
                    return utxos[utxos.length - 1];
            }
            catch (e) {
                console.error(e);
            }
            await new Promise((resolve) => setTimeout(resolve, 3000));
        }
    }
    ;
    async sign(signer) {
        if (this.isNative())
            throw Error("BurnRequest#sign(): can't sign transaction for ETH");
        if (!this.nonce || !this.tokenName)
            await this.fetchData();
        try {
            const payload = this.toEIP712();
            delete payload.types.EIP712Domain;
            const sig = await signer._signTypedData(payload.domain, payload.types, payload.message);
            return (this.signature = (0, bytes_1.joinSignature)((0, bytes_1.splitSignature)(sig)));
        }
        catch (e) {
            console.error(e);
            return (this.signature = await signer.provider.send("eth_signTypedData_v4", [await signer.getAddress(), this.toEIP712()]));
        }
    }
    ;
    async publish(peer) {
        /*
          if (!this.isNative()) return super.publish(peer);
          else {
            const result = new PublishEventEmitter();
            setTimeout(() => result.emit("finish"), 0);
          }
       */
        return {};
    }
    ;
    async fetchData() {
        if ((0, address_1.getAddress)(common_1.FIXTURES.ETHEREUM.USDT) === (0, address_1.getAddress)(this.asset)) {
            this.nonce = String(await new contracts_1.Contract(this.contractAddress, ["function noncesUsdt(address) view returns (uint256)"], (0, chains_1.getVanillaProvider)(this)).noncesUsdt(this.owner));
            this.tokenName = "USDT";
        }
        else if ((0, address_1.getAddress)(common_1.FIXTURES.AVALANCHE.USDC) === (0, address_1.getAddress)(this.asset)) {
            this.nonce = String(await new contracts_1.Contract(this.contractAddress, ["function noncesUsdc(address) view returns (uint256)"], (0, chains_1.getVanillaProvider)(this)).noncesUsdc(this.owner));
            this.tokenName = "USD Coin";
        }
        else if (isWBTC(this.asset) ||
            (this.getChainId() === 43114 &&
                (0, address_1.getAddress)(common_1.FIXTURES.AVALANCHE.USDC) === (0, address_1.getAddress)(this.asset))) {
            this.nonce = String(await new contracts_1.Contract(this.contractAddress, ["function nonces(address) view returns (uint256)"], (0, chains_1.getVanillaProvider)(this)).nonces(this.owner));
            if (isWBTC(this.asset))
                this.tokenName = "WBTC";
            else
                this.tokenName = "USDC";
        }
        else {
            const token = new contracts_1.Contract(this.asset, [
                "function nonces(address) view returns (uint256)",
                "function name() view returns (string)",
            ], (0, chains_1.getVanillaProvider)(this));
            this.nonce = String(await token.nonces(this.owner));
            this.tokenName = await token.name();
        }
        return this;
    }
    ;
    buildTransaction() {
        return {
            chainId: this.getChainId(),
            data: new abi_1.Interface([
                "function burn(address, address, uint256, uint256, bytes, bytes, bytes)",
            ]).encodeFunctionData("burn", [
                this.owner,
                this.asset,
                this.amount,
                this.getExpiry(),
                this.data,
                this.destination,
                this.signature,
            ]),
            to: this.contractAddress,
        };
    }
    ;
}
exports.BurnRequest = BurnRequest;
//# sourceMappingURL=BurnRequest.js.map