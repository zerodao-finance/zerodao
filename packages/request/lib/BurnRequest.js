"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BurnRequest = void 0;
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
const chains_1 = require("@zerodao/chains");
const Request_1 = require("./Request");
const PublishEventEmitter_1 = require("./PublishEventEmitter");
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
        constants_1.AddressZero.substr(0, 41) + "1")) === (0, address_1.getAddress)(address));
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
    const chainId = this.getChainId();
    if (isUSDC(this)) {
        if (chainId === 137) {
            return {
                name: "USD Coin (PoS)",
                version: "1",
                verifyingContract: this.asset || constants_1.AddressZero,
                salt: (0, bytes_1.hexZeroPad)(bignumber_1.BigNumber.from(String(this.getChainId()) || "1").toHexString(), 32),
            };
        }
        if (chainId === 42161) {
            return {
                name: "USD Coin (Arb1)",
                version: "1",
                chainId: String(chainId),
                verifyingContract: this.asset || constants_1.AddressZero,
            };
        }
        return {
            name: "USD Coin",
            version: "2",
            chainId: this.getChainId(),
            verifyingContract: this.asset,
        };
    }
    return {
        name: this.tokenName,
        version: "1",
        chainId: String(chainId),
        verifyingContract: this.asset,
    };
}
function getMessage(request) {
    if (isUSDC(request.asset)) {
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
const isZcashAddress = (hex) => Buffer.from((0, bytes_1.hexlify)(hex).substr(2), "hex").toString("utf8")[0] === "t";
function getRenAssetName(request) {
    return isZcashAddress(request.destination) ? "renZEC" : "renBTC";
}
function toFixtureName(chainId) {
    switch (chainId) {
        case 1:
            return "ETHEREUM";
        case 137:
            return "MATIC";
        case 43114:
            return "AVALANCHE";
        case 42161:
            return "ARBITRUM";
        case 10:
            return "OPTIMISM";
    }
}
function getRenAsset(request) {
    const provider = (0, chains_1.getVanillaProvider)(request);
    const address = common_1.FIXTURES[toFixtureName(request.getChainId())][getRenAssetName(request)];
    return new contracts_1.Contract(address, [
        "event Transfer(address indexed from, address indexed to, uint256 amount)",
    ], provider);
}
class BurnRequest extends Request_1.Request {
    constructor(o) {
        super();
        this.asset = o.asset;
        this.data = o.data;
        this.owner = o.owner;
        this.destination = o.destination;
        this.deadline = o.deadline;
        this.amount = o.amount;
        this.contractAddress = o.contractAddress;
    }
    static get PROTOCOL() {
        return "/zero/1.1.0/dispatch";
    }
    static minOutFromData(data) {
        const [result] = coder.decode(["uint256"], data);
        return result;
    }
    static dataFromMinOut(minOut) {
        return coder.encode(['uint256'], [minOut]);
    }
    async sendTransaction(signer) {
        const { contractAddress, amount, destination } = this;
        const contract = new contracts_1.Contract(this.contractAddress, [
            "function burnApproved(address, address, uint256, uint256, bytes) payable",
        ], signer);
        const tx = await contract.burnApproved(constants_1.AddressZero, this.asset, this.isNative() ? "0" : this.amount, BurnRequest.minOutFromData(this.data), this.destination, this.isNative() ? { value: this.amount } : {});
        remoteTxMap.set(this, tx.wait());
    }
    serialize() {
        return Buffer.from(JSON.stringify({
            asset: this.asset,
            data: this.data,
            owner: this.owner,
            destination: this.destination,
            deadline: this.getExpiry(),
            amount: this.amount,
            contractAddress: this.contractAddress,
        }));
    }
    isNative() {
        return this.asset === constants_1.AddressZero;
    }
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
    getHandlerForDestinationChain() {
        return isZcashAddress(this.destination) ? ZECHandler_1.ZECHandler : BTCHandler_1.BTCHandler;
    }
    getNormalizedDestinationAddress() {
        if (isZcashAddress(this.destination))
            return Buffer.from((0, bytes_1.hexlify)(this.destination).substr(2), "hex").toString("utf8"); // implement zcash encoding here
        const arrayed = Array.from((0, bytes_1.arrayify)(this.destination));
        let address;
        if (arrayed.length > 40)
            address = Buffer.from(arrayed).toString("utf8");
        else
            address = basex_1.Base58.encode(this.destination);
        return address;
    }
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
    publish(peer) {
        if (!this.isNative())
            return super.publish(peer);
        else {
            const result = new PublishEventEmitter_1.PublishEventEmitter();
            setTimeout(() => result.emit("finish"), 0);
        }
    }
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
            this.nonce = await token.nonces(this.owner);
            this.tokenName = await token.name();
        }
        return this;
    }
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
}
exports.BurnRequest = BurnRequest;
//# sourceMappingURL=BurnRequest.js.map