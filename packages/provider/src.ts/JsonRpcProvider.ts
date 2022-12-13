import { Provider, TransactionRequest, TransactionResponse } from "@ethersproject/abstract-provider";
import { Signer, TypedDataDomain, TypedDataField, TypedDataSigner } from "@ethersproject/abstract-signer";
import { BigNumber } from "@ethersproject/bignumber";
import { Bytes, hexlify, hexValue, hexZeroPad, isHexString } from "@ethersproject/bytes";
import { _TypedDataEncoder } from "@ethersproject/hash";
import { Network, Networkish } from "@ethersproject/networks";
import { checkProperties, deepCopy, Deferrable, defineReadOnly, getStatic, resolveProperties, shallowCopy } from "@ethersproject/properties";
import { toUtf8Bytes } from "@ethersproject/strings";
import { AccessList, accessListify } from "@ethersproject/transactions";
import { ConnectionInfo, fetchJson, poll } from "@ethersproject/web";

import { Logger } from "@ethersproject/logger";

export class JsonRpcProvider extends BaseProvider {
    readonly connection: ConnectionInfo;

    _pendingFilter: Promise<number>;
    _nextId: number;

    // During any given event loop, the results for a given call will
    // all be the same, so we can dedup the calls to save requests and
    // bandwidth. @TODO: Try out generalizing this against send?
    _eventLoopCache: Record<string, Promise<any>>;
    get _cache(): Record<string, Promise<any>> {
        if (this._eventLoopCache == null) {
            this._eventLoopCache = { };
        }
        return this._eventLoopCache;
    }

    constructor(url?: ConnectionInfo | string, network?: Networkish) {
        let networkOrReady: Networkish | Promise<Network> = network;

        // The network is unknown, query the JSON-RPC for it
        if (networkOrReady == null) {
            networkOrReady = new Promise((resolve, reject) => {
                setTimeout(() => {
                    this.detectNetwork().then((network) => {
                        resolve(network);
                    }, (error) => {
                        reject(error);
                    });
                }, 0);
            });
        }

        super(networkOrReady);

        // Default URL
        if (!url) { url = getStatic<() => string>(this.constructor, "defaultUrl")(); }

        if (typeof(url) === "string") {
            defineReadOnly(this, "connection",Object.freeze({
                url: url
            }));
        } else {
            defineReadOnly(this, "connection", Object.freeze(shallowCopy(url)));
        }

        this._nextId = 42;
    }

    static defaultUrl(): string {
        return "http:/\/localhost:8545";
    }

    detectNetwork(): Promise<Network> {
        if (!this._cache["detectNetwork"]) {
            this._cache["detectNetwork"] = this._uncachedDetectNetwork();

            // Clear this cache at the beginning of the next event loop
            setTimeout(() => {
                this._cache["detectNetwork"] = null;
            }, 0);
        }
        return this._cache["detectNetwork"];
    }

    async _uncachedDetectNetwork(): Promise<Network> {
        await timer(0);

        let chainId = null;
        try {
            chainId = await this.send("eth_chainId", [ ]);
        } catch (error) {
            try {
                chainId = await this.send("net_version", [ ]);
            } catch (error) { }
        }

        if (chainId != null) {
            const getNetwork = getStatic<(network: Networkish) => Network>(this.constructor, "getNetwork");
            try {
                return getNetwork(BigNumber.from(chainId).toNumber());
            } catch (error) {
                return logger.throwError("could not detect network", Logger.errors.NETWORK_ERROR, {
                    chainId: chainId,
                    event: "invalidNetwork",
                    serverError: error
                });
            }
        }

        return logger.throwError("could not detect network", Logger.errors.NETWORK_ERROR, {
            event: "noNetwork"
        });
    }

    getSigner(addressOrIndex?: string | number): JsonRpcSigner {
        return new JsonRpcSigner(_constructorGuard, this, addressOrIndex);
    }

    getUncheckedSigner(addressOrIndex?: string | number): UncheckedJsonRpcSigner {
        return this.getSigner(addressOrIndex).connectUnchecked();
    }

    listAccounts(): Promise<Array<string>> {
        return this.send("eth_accounts", []).then((accounts: Array<string>) => {
            return accounts.map((a) => this.formatter.address(a));
        });
    }

    send(method: string, params: Array<any>): Promise<any> {
        const request = {
            method: method,
            params: params,
            id: (this._nextId++),
            jsonrpc: "2.0"
        };

        this.emit("debug", {
            action: "request",
            request: deepCopy(request),
            provider: this
        });

        // We can expand this in the future to any call, but for now these
        // are the biggest wins and do not require any serializing parameters.
        const cache = ([ "eth_chainId", "eth_blockNumber" ].indexOf(method) >= 0);
        if (cache && this._cache[method]) {
            return this._cache[method];
        }

        const result = fetchJson(this.connection, JSON.stringify(request), getResult).then((result) => {
            this.emit("debug", {
                action: "response",
                request: request,
                response: result,
                provider: this
            });

            return result;

        }, (error) => {
            this.emit("debug", {
                action: "response",
                error: error,
                request: request,
                provider: this
            });

            throw error;
        });

        // Cache the fetch, but clear it on the next event loop
        if (cache) {
            this._cache[method] = result;
            setTimeout(() => {
                this._cache[method] = null;
            }, 0);
        }

        return result;
    }

    prepareRequest(method: string, params: any): [ string, Array<any> ] {
        switch (method) {
            case "getBlockNumber":
                return [ "eth_blockNumber", [] ];

            case "getGasPrice":
                return [ "eth_gasPrice", [] ];

            case "getBalance":
                return [ "eth_getBalance", [ getLowerCase(params.address), params.blockTag ] ];

            case "getTransactionCount":
                return [ "eth_getTransactionCount", [ getLowerCase(params.address), params.blockTag ] ];

            case "getCode":
                return [ "eth_getCode", [ getLowerCase(params.address), params.blockTag ] ];

            case "getStorageAt":
                return [ "eth_getStorageAt", [ getLowerCase(params.address), hexZeroPad(params.position, 32), params.blockTag ] ];

            case "sendTransaction":
                return [ "eth_sendRawTransaction", [ params.signedTransaction ] ]

            case "getBlock":
                if (params.blockTag) {
                    return [ "eth_getBlockByNumber", [ params.blockTag, !!params.includeTransactions ] ];
                } else if (params.blockHash) {
                    return [ "eth_getBlockByHash", [ params.blockHash, !!params.includeTransactions ] ];
                }
                return null;

            case "getTransaction":
                return [ "eth_getTransactionByHash", [ params.transactionHash ] ];

            case "getTransactionReceipt":
                return [ "eth_getTransactionReceipt", [ params.transactionHash ] ];

            case "call": {
                const hexlifyTransaction = getStatic<(t: TransactionRequest, a?: { [key: string]: boolean }) => { [key: string]: string }>(this.constructor, "hexlifyTransaction");
                return [ "eth_call", [ hexlifyTransaction(params.transaction, { from: true }), params.blockTag ] ];
            }

            case "estimateGas": {
                const hexlifyTransaction = getStatic<(t: TransactionRequest, a?: { [key: string]: boolean }) => { [key: string]: string }>(this.constructor, "hexlifyTransaction");
                return [ "eth_estimateGas", [ hexlifyTransaction(params.transaction, { from: true }) ] ];
            }

            case "getLogs":
                if (params.filter && params.filter.address != null) {
                    params.filter.address = getLowerCase(params.filter.address);
                }
                return [ "eth_getLogs", [ params.filter ] ];

            default:
                break;
        }

        return null;
    }

    async perform(method: string, params: any): Promise<any> {
        // Legacy networks do not like the type field being passed along (which
        // is fair), so we delete type if it is 0 and a non-EIP-1559 network
        if (method === "call" || method === "estimateGas") {
            const tx = params.transaction;
            if (tx && tx.type != null && BigNumber.from(tx.type).isZero()) {
                // If there are no EIP-1559 properties, it might be non-EIP-1559
                if (tx.maxFeePerGas == null && tx.maxPriorityFeePerGas == null) {
                    const feeData = await this.getFeeData();
                    if (feeData.maxFeePerGas == null && feeData.maxPriorityFeePerGas == null) {
                        // Network doesn't know about EIP-1559 (and hence type)
                        params = shallowCopy(params);
                        params.transaction = shallowCopy(tx);
                        delete params.transaction.type;
                    }
                }
            }
        }

        const args = this.prepareRequest(method,  params);

        if (args == null) {
            logger.throwError(method + " not implemented", Logger.errors.NOT_IMPLEMENTED, { operation: method });
        }
        try {
            return await this.send(args[0], args[1])
        } catch (error) {
            return checkError(method, error, params);
        }
    }

    _startEvent(event: Event): void {
        if (event.tag === "pending") { this._startPending(); }
        super._startEvent(event);
    }

    _startPending(): void {
        if (this._pendingFilter != null) { return; }
        const self = this;

        const pendingFilter: Promise<number> = this.send("eth_newPendingTransactionFilter", []);
        this._pendingFilter = pendingFilter;

        pendingFilter.then(function(filterId) {
            function poll() {
                self.send("eth_getFilterChanges", [ filterId ]).then(function(hashes: Array<string>) {
                    if (self._pendingFilter != pendingFilter) { return null; }

                    let seq = Promise.resolve();
                    hashes.forEach(function(hash) {
                        // @TODO: This should be garbage collected at some point... How? When?
                        self._emitted["t:" + hash.toLowerCase()] = "pending";
                        seq = seq.then(function() {
                            return self.getTransaction(hash).then(function(tx) {
                                self.emit("pending", tx);
                                return null;
                            });
                        });
                    });

                    return seq.then(function() {
                        return timer(1000);
                    });
                }).then(function() {
                    if (self._pendingFilter != pendingFilter) {
                        self.send("eth_uninstallFilter", [ filterId ]);
                        return;
                    }
                    setTimeout(function() { poll(); }, 0);

                    return null;
                }).catch((error: Error) => { });
            }
            poll();

            return filterId;
        }).catch((error: Error) => { });
    }

    _stopEvent(event: Event): void {
        if (event.tag === "pending" && this.listenerCount("pending") === 0) {
            this._pendingFilter = null;
        }
        super._stopEvent(event);
    }

    // Convert an ethers.js transaction into a JSON-RPC transaction
    //  - gasLimit => gas
    //  - All values hexlified
    //  - All numeric values zero-striped
    //  - All addresses are lowercased
    // NOTE: This allows a TransactionRequest, but all values should be resolved
    //       before this is called
    // @TODO: This will likely be removed in future versions and prepareRequest
    //        will be the preferred method for this.
    static hexlifyTransaction(transaction: TransactionRequest, allowExtra?: { [key: string]: boolean }): { [key: string]: string | AccessList } {
        // Check only allowed properties are given
        const allowed = shallowCopy(allowedTransactionKeys);
        if (allowExtra) {
            for (const key in allowExtra) {
                if (allowExtra[key]) { allowed[key] = true; }
            }
        }

        checkProperties(transaction, allowed);

        const result: { [key: string]: string | AccessList } = {};

        // JSON-RPC now requires numeric values to be "quantity" values
        ["chainId", "gasLimit", "gasPrice", "type", "maxFeePerGas", "maxPriorityFeePerGas", "nonce", "value"].forEach(function(key) {
            if ((<any>transaction)[key] == null) { return; }
            const value = hexValue(BigNumber.from((<any>transaction)[key]));
            if (key === "gasLimit") { key = "gas"; }
            result[key] = value;
        });

        ["from", "to", "data"].forEach(function(key) {
            if ((<any>transaction)[key] == null) { return; }
            result[key] = hexlify((<any>transaction)[key]);
        });

        if ((<any>transaction).accessList) {
            result["accessList"] = accessListify((<any>transaction).accessList);
        }

        return result;
    }
}