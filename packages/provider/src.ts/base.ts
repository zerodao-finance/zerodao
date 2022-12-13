import {
    Block, BlockTag, BlockWithTransactions, EventType, Filter, FilterByBlockHash, ForkEvent,
    Listener, Log, Provider, TransactionReceipt, TransactionRequest, TransactionResponse
} from "@ethersproject/abstract-provider";
import { encode as base64Encode } from "@ethersproject/base64";
import { Base58 } from "@ethersproject/basex";
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { arrayify, BytesLike, concat, hexConcat, hexDataLength, hexDataSlice, hexlify, hexValue, hexZeroPad, isHexString } from "@ethersproject/bytes";
import { HashZero } from "@ethersproject/constants";
import { dnsEncode, namehash } from "@ethersproject/hash";
import { getNetwork, Network, Networkish } from "@ethersproject/networks";
import { Deferrable, defineReadOnly, getStatic, resolveProperties } from "@ethersproject/properties";
import { Transaction } from "@ethersproject/transactions";
import { sha256 } from "@ethersproject/sha2";
import { toUtf8Bytes, toUtf8String } from "@ethersproject/strings";
import { fetchJson, poll } from "@ethersproject/web";

import bech32 from "bech32";

import { Logger } from "@ethersproject/logger";

export class BaseProvider extends Provider implements EnsProvider {
    _networkPromise: Promise<Network>;
    _network: Network;

    _events: Array<Event>;

    formatter: Formatter;

    // To help mitigate the eventually consistent nature of the blockchain
    // we keep a mapping of events we emit. If we emit an event X, we expect
    // that a user should be able to query for that event in the callback,
    // if the node returns null, we stall the response until we get back a
    // meaningful value, since we may be hitting a re-org, or a node that
    // has not indexed the event yet.
    // Events:
    //   - t:{hash}    - Transaction hash
    //   - b:{hash}    - BlockHash
    //   - block       - The most recent emitted block
    _emitted: { [ eventName: string ]: number | "pending" };

    _pollingInterval: number;
    _poller: NodeJS.Timer;
    _bootstrapPoll: NodeJS.Timer;

    _lastBlockNumber: number;
    _maxFilterBlockRange: number;

    _fastBlockNumber: number;
    _fastBlockNumberPromise: Promise<number>;
    _fastQueryDate: number;

    _maxInternalBlockNumber: number;
    _internalBlockNumber: Promise<{ blockNumber: number, reqTime: number, respTime: number }>;

    readonly anyNetwork: boolean;

    disableCcipRead: boolean;


    /**
     *  ready
     *
     *  A Promise<Network> that resolves only once the provider is ready.
     *
     *  Sub-classes that call the super with a network without a chainId
     *  MUST set this. Standard named networks have a known chainId.
     *
     */

    constructor(network: Networkish | Promise<Network>) {
        super();

        // Events being listened to
        this._events = [];

        this._emitted = { block: -2 };

        this.disableCcipRead = false;

        this.formatter = new.target.getFormatter();

        // If network is any, this Provider allows the underlying
        // network to change dynamically, and we auto-detect the
        // current network
        defineReadOnly(this, "anyNetwork", (network === "any"));
        if (this.anyNetwork) { network = this.detectNetwork(); }

        if (network instanceof Promise) {
            this._networkPromise = network;

            // Squash any "unhandled promise" errors; that do not need to be handled
            network.catch((error) => { });

            // Trigger initial network setting (async)
            this._ready().catch((error) => { });

        } else {
            const knownNetwork = getStatic<(network: Networkish) => Network>(new.target, "getNetwork")(network);
            if (knownNetwork) {
                defineReadOnly(this, "_network", knownNetwork);
                this.emit("network", knownNetwork, null);

            } else {
                logger.throwArgumentError("invalid network", "network", network);
            }
        }

        this._maxInternalBlockNumber = -1024;

        this._lastBlockNumber = -2;
        this._maxFilterBlockRange = 10;

        this._pollingInterval = 4000;

        this._fastQueryDate = 0;
    }

    async _ready(): Promise<Network> {
        if (this._network == null) {
            let network: Network = null;
            if (this._networkPromise) {
                try {
                    network = await this._networkPromise;
                } catch (error) { }
            }

            // Try the Provider's network detection (this MUST throw if it cannot)
            if (network == null) {
                network = await this.detectNetwork();
            }

            // This should never happen; every Provider sub-class should have
            // suggested a network by here (or have thrown).
            if (!network) {
                logger.throwError("no network detected", Logger.errors.UNKNOWN_ERROR, { });
            }

            // Possible this call stacked so do not call defineReadOnly again
            if (this._network == null) {
                if (this.anyNetwork) {
                    this._network = network;
                } else {
                    defineReadOnly(this, "_network", network);
                }
                this.emit("network", network, null);
            }
        }

        return this._network;
    }

    // This will always return the most recently established network.
    // For "any", this can change (a "network" event is emitted before
    // any change is reflected); otherwise this cannot change
    get ready(): Promise<Network> {
        return poll(() => {
            return this._ready().then((network) => {
                return network;
            }, (error) => {
                // If the network isn't running yet, we will wait
                if (error.code === Logger.errors.NETWORK_ERROR && error.event === "noNetwork") {
                    return undefined;
                }
                throw error;
            });
        });
    }

    // @TODO: Remove this and just create a singleton formatter
    static getFormatter(): Formatter {
        if (defaultFormatter == null) {
            defaultFormatter = new Formatter();
        }
        return defaultFormatter;
    }

    // @TODO: Remove this and just use getNetwork
    static getNetwork(network: Networkish): Network {
        return getNetwork((network == null) ? "homestead": network);
    }

    async ccipReadFetch(tx: Transaction, calldata: string, urls: Array<string>): Promise<null | string> {
        if (this.disableCcipRead || urls.length === 0) { return null; }

        const sender = tx.to.toLowerCase();
        const data = calldata.toLowerCase();

        const errorMessages: Array<string> = [ ];

        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];

            // URL expansion
            const href = url.replace("{sender}", sender).replace("{data}", data);

            // If no {data} is present, use POST; otherwise GET
            const json: string | null = (url.indexOf("{data}") >= 0) ? null: JSON.stringify({ data, sender });

            const result = await fetchJson({ url: href, errorPassThrough: true }, json, (value, response) => {
                value.status = response.statusCode;
                return value;
            });

            if (result.data) { return result.data; }

            const errorMessage = (result.message || "unknown error");

            // 4xx indicates the result is not present; stop
            if (result.status >= 400 && result.status < 500) {
                return logger.throwError(`response not found during CCIP fetch: ${ errorMessage }`, Logger.errors.SERVER_ERROR, { url, errorMessage });
            }

            // 5xx indicates server issue; try the next url
            errorMessages.push(errorMessage);
        }

        return logger.throwError(`error encountered during CCIP fetch: ${ errorMessages.map((m) => JSON.stringify(m)).join(", ") }`, Logger.errors.SERVER_ERROR, {
            urls, errorMessages
        });
    }

    // Fetches the blockNumber, but will reuse any result that is less
    // than maxAge old or has been requested since the last request
    async _getInternalBlockNumber(maxAge: number): Promise<number> {
        await this._ready();

        // Allowing stale data up to maxAge old
        if (maxAge > 0) {

            // While there are pending internal block requests...
            while (this._internalBlockNumber) {

                // ..."remember" which fetch we started with
                const internalBlockNumber = this._internalBlockNumber;

                try {
                    // Check the result is not too stale
                    const result = await internalBlockNumber;
                    if ((getTime() - result.respTime) <= maxAge) {
                        return result.blockNumber;
                    }

                    // Too old; fetch a new value
                    break;

                } catch(error) {

                    // The fetch rejected; if we are the first to get the
                    // rejection, drop through so we replace it with a new
                    // fetch; all others blocked will then get that fetch
                    // which won't match the one they "remembered" and loop
                    if (this._internalBlockNumber === internalBlockNumber) {
                        break;
                    }
                }
            }
        }

        const reqTime = getTime();

        const checkInternalBlockNumber = resolveProperties({
            blockNumber: this.perform("getBlockNumber", { }),
            networkError: this.getNetwork().then((network) => (null), (error) => (error))
        }).then(({ blockNumber, networkError }) => {
            if (networkError) {
                // Unremember this bad internal block number
                if (this._internalBlockNumber === checkInternalBlockNumber) {
                    this._internalBlockNumber = null;
                }
                throw networkError;
            }

            const respTime = getTime();

            blockNumber = BigNumber.from(blockNumber).toNumber();
            if (blockNumber < this._maxInternalBlockNumber) { blockNumber = this._maxInternalBlockNumber; }

            this._maxInternalBlockNumber = blockNumber;
            this._setFastBlockNumber(blockNumber); // @TODO: Still need this?
            return { blockNumber, reqTime, respTime };
        });

        this._internalBlockNumber = checkInternalBlockNumber;

        // Swallow unhandled exceptions; if needed they are handled else where
        checkInternalBlockNumber.catch((error) => {
            // Don't null the dead (rejected) fetch, if it has already been updated
            if (this._internalBlockNumber === checkInternalBlockNumber) {
                this._internalBlockNumber = null;
            }
        });

        return (await checkInternalBlockNumber).blockNumber;
    }

    async poll(): Promise<void> {
        const pollId = nextPollId++;

        // Track all running promises, so we can trigger a post-poll once they are complete
        const runners: Array<Promise<void>> = [];

        let blockNumber: number = null;
        try {
            blockNumber = await this._getInternalBlockNumber(100 + this.pollingInterval / 2);
        } catch (error) {
            this.emit("error", error);
            return;
        }
        this._setFastBlockNumber(blockNumber);

        // Emit a poll event after we have the latest (fast) block number
        this.emit("poll", pollId, blockNumber);

        // If the block has not changed, meh.
        if (blockNumber === this._lastBlockNumber) {
            this.emit("didPoll", pollId);
            return;
        }

        // First polling cycle, trigger a "block" events
        if (this._emitted.block === -2) {
            this._emitted.block = blockNumber - 1;
        }

        if (Math.abs((<number>(this._emitted.block)) - blockNumber) > 1000) {
            logger.warn(`network block skew detected; skipping block events (emitted=${ this._emitted.block } blockNumber${ blockNumber })`);
            this.emit("error", logger.makeError("network block skew detected", Logger.errors.NETWORK_ERROR, {
                blockNumber: blockNumber,
                event: "blockSkew",
                previousBlockNumber: this._emitted.block
            }));
            this.emit("block", blockNumber);

        } else {
            // Notify all listener for each block that has passed
            for (let i = (<number>this._emitted.block) + 1; i <= blockNumber; i++) {
                this.emit("block", i);
            }
        }

        // The emitted block was updated, check for obsolete events
        if ((<number>this._emitted.block) !== blockNumber) {
            this._emitted.block = blockNumber;

            Object.keys(this._emitted).forEach((key) => {
                // The block event does not expire
                if (key === "block") { return; }

                // The block we were at when we emitted this event
                const eventBlockNumber = this._emitted[key];

                // We cannot garbage collect pending transactions or blocks here
                // They should be garbage collected by the Provider when setting
                // "pending" events
                if (eventBlockNumber === "pending") { return; }

                // Evict any transaction hashes or block hashes over 12 blocks
                // old, since they should not return null anyways
                if (blockNumber - eventBlockNumber > 12) {
                    delete this._emitted[key];
                }
            });
        }

        // First polling cycle
        if (this._lastBlockNumber === -2) {
            this._lastBlockNumber = blockNumber - 1;
        }
        // Find all transaction hashes we are waiting on
        this._events.forEach((event) => {
            switch (event.type) {
                case "tx": {
                    const hash = event.hash;
                    let runner = this.getTransactionReceipt(hash).then((receipt) => {
                        if (!receipt || receipt.blockNumber == null) { return null; }
                        this._emitted["t:" + hash] = receipt.blockNumber;
                        this.emit(hash, receipt);
                        return null;
                    }).catch((error: Error) => { this.emit("error", error); });

                    runners.push(runner);

                    break;
                }

                case "filter": {
                    // We only allow a single getLogs to be in-flight at a time
                    if (!event._inflight) {
                        event._inflight = true;

                        // This is the first filter for this event, so we want to
                        // restrict events to events that happened no earlier than now
                        if (event._lastBlockNumber === -2) {
                            event._lastBlockNumber = blockNumber - 1;
                        }

                        // Filter from the last *known* event; due to load-balancing
                        // and some nodes returning updated block numbers before
                        // indexing events, a logs result with 0 entries cannot be
                        // trusted and we must retry a range which includes it again
                        const filter = event.filter;
                        filter.fromBlock = event._lastBlockNumber + 1;
                        filter.toBlock = blockNumber;

                        // Prevent fitler ranges from growing too wild, since it is quite
                        // likely there just haven't been any events to move the lastBlockNumber.
                        const minFromBlock = filter.toBlock - this._maxFilterBlockRange;
                        if (minFromBlock > filter.fromBlock) { filter.fromBlock = minFromBlock; }

                        if (filter.fromBlock < 0) { filter.fromBlock = 0; }

                        const runner = this.getLogs(filter).then((logs) => {
                            // Allow the next getLogs
                            event._inflight = false;

                            if (logs.length === 0) { return; }

                            logs.forEach((log: Log) => {
                                // Only when we get an event for a given block number
                                // can we trust the events are indexed
                                if (log.blockNumber > event._lastBlockNumber) {
                                    event._lastBlockNumber = log.blockNumber;
                                }

                                // Make sure we stall requests to fetch blocks and txs
                                this._emitted["b:" + log.blockHash] = log.blockNumber;
                                this._emitted["t:" + log.transactionHash] = log.blockNumber;

                                this.emit(filter, log);
                            });
                        }).catch((error: Error) => {
                            this.emit("error", error);

                            // Allow another getLogs (the range was not updated)
                            event._inflight = false;
                        });
                        runners.push(runner);
                    }

                    break;
                }
            }
        });

        this._lastBlockNumber = blockNumber;

        // Once all events for this loop have been processed, emit "didPoll"
        Promise.all(runners).then(() => {
            this.emit("didPoll", pollId);
        }).catch((error) => { this.emit("error", error); });

        return;
    }

    // Deprecated; do not use this
    resetEventsBlock(blockNumber: number): void {
        this._lastBlockNumber = blockNumber - 1;
        if (this.polling) { this.poll(); }
    }

    get network(): Network {
        return this._network;
    }

    // This method should query the network if the underlying network
    // can change, such as when connected to a JSON-RPC backend
    async detectNetwork(): Promise<Network> {
        return logger.throwError("provider does not support network detection", Logger.errors.UNSUPPORTED_OPERATION, {
            operation: "provider.detectNetwork"
        });
    }

    async getNetwork(): Promise<Network> {
        const network = await this._ready();

        // Make sure we are still connected to the same network; this is
        // only an external call for backends which can have the underlying
        // network change spontaneously
        const currentNetwork = await this.detectNetwork();
        if (network.chainId !== currentNetwork.chainId) {

            // We are allowing network changes, things can get complex fast;
            // make sure you know what you are doing if you use "any"
            if (this.anyNetwork) {
                this._network = currentNetwork;

                // Reset all internal block number guards and caches
                this._lastBlockNumber = -2;
                this._fastBlockNumber = null;
                this._fastBlockNumberPromise = null;
                this._fastQueryDate = 0;
                this._emitted.block = -2;
                this._maxInternalBlockNumber = -1024;
                this._internalBlockNumber = null;

                // The "network" event MUST happen before this method resolves
                // so any events have a chance to unregister, so we stall an
                // additional event loop before returning from /this/ call
                this.emit("network", currentNetwork, network);
                await stall(0);

                return this._network;
            }

            const error = logger.makeError("underlying network changed", Logger.errors.NETWORK_ERROR, {
                event: "changed",
                network: network,
                detectedNetwork: currentNetwork
            });

            this.emit("error", error);
            throw error;
        }

        return network;
    }

    get blockNumber(): number {
        this._getInternalBlockNumber(100 + this.pollingInterval / 2).then((blockNumber) => {
            this._setFastBlockNumber(blockNumber);
        }, (error) => { });

        return (this._fastBlockNumber != null) ? this._fastBlockNumber: -1;
    }

    get polling(): boolean {
        return (this._poller != null);
    }

    set polling(value: boolean) {
        if (value && !this._poller) {
            this._poller = setInterval(() => { this.poll(); }, this.pollingInterval);

            if (!this._bootstrapPoll) {
                this._bootstrapPoll = setTimeout(() => {
                    this.poll();

                    // We block additional polls until the polling interval
                    // is done, to prevent overwhelming the poll function
                    this._bootstrapPoll = setTimeout(() => {
                        // If polling was disabled, something may require a poke
                        // since starting the bootstrap poll and it was disabled
                        if (!this._poller) { this.poll(); }

                        // Clear out the bootstrap so we can do another
                        this._bootstrapPoll = null;
                    }, this.pollingInterval);
                }, 0);
            }

        } else if (!value && this._poller) {
            clearInterval(this._poller);
            this._poller = null;
        }
    }

    get pollingInterval(): number {
        return this._pollingInterval;
    }

    set pollingInterval(value: number) {
        if (typeof(value) !== "number" || value <= 0 || parseInt(String(value)) != value) {
            throw new Error("invalid polling interval");
        }

        this._pollingInterval = value;

        if (this._poller) {
            clearInterval(this._poller);
            this._poller = setInterval(() => { this.poll(); }, this._pollingInterval);
        }
    }

    _getFastBlockNumber(): Promise<number> {
        const now = getTime();

        // Stale block number, request a newer value
        if ((now - this._fastQueryDate) > 2 * this._pollingInterval) {
            this._fastQueryDate = now;
            this._fastBlockNumberPromise = this.getBlockNumber().then((blockNumber) => {
                if (this._fastBlockNumber == null || blockNumber > this._fastBlockNumber) {
                    this._fastBlockNumber = blockNumber;
                }
                return this._fastBlockNumber;
            });
        }

        return this._fastBlockNumberPromise;
    }

    _setFastBlockNumber(blockNumber: number): void {
        // Older block, maybe a stale request
        if (this._fastBlockNumber != null && blockNumber < this._fastBlockNumber) { return; }

        // Update the time we updated the blocknumber
        this._fastQueryDate = getTime();

        // Newer block number, use  it
        if (this._fastBlockNumber == null || blockNumber > this._fastBlockNumber) {
            this._fastBlockNumber = blockNumber;
            this._fastBlockNumberPromise = Promise.resolve(blockNumber);
        }
    }

    async waitForTransaction(transactionHash: string, confirmations?: number, timeout?: number): Promise<TransactionReceipt> {
        return this._waitForTransaction(transactionHash, (confirmations == null) ? 1: confirmations, timeout || 0, null);
    }

    async _waitForTransaction(transactionHash: string, confirmations: number, timeout: number, replaceable: { data: string, from: string, nonce: number, to: string, value: BigNumber, startBlock: number }): Promise<TransactionReceipt> {
        const receipt = await this.getTransactionReceipt(transactionHash);

        // Receipt is already good
        if ((receipt ? receipt.confirmations: 0) >= confirmations) { return receipt; }

        // Poll until the receipt is good...
        return new Promise((resolve, reject) => {
            const cancelFuncs: Array<() => void> = [];

            let done = false;
            const alreadyDone = function() {
                if (done) { return true; }
                done = true;
                cancelFuncs.forEach((func) => { func(); });
                return false;
            };

            const minedHandler = (receipt: TransactionReceipt) => {
                if (receipt.confirmations < confirmations) { return; }
                if (alreadyDone()) { return; }
                resolve(receipt);
            }
            this.on(transactionHash, minedHandler);
            cancelFuncs.push(() => { this.removeListener(transactionHash, minedHandler); });

            if (replaceable) {
                let lastBlockNumber = replaceable.startBlock;
                let scannedBlock: number = null;
                const replaceHandler = async (blockNumber: number) => {
                    if (done) { return; }

                    // Wait 1 second; this is only used in the case of a fault, so
                    // we will trade off a little bit of latency for more consistent
                    // results and fewer JSON-RPC calls
                    await stall(1000);

                    this.getTransactionCount(replaceable.from).then(async (nonce) => {
                        if (done) { return; }

                        if (nonce <= replaceable.nonce) {
                            lastBlockNumber = blockNumber;

                        } else {
                            // First check if the transaction was mined
                            {
                                const mined = await this.getTransaction(transactionHash);
                                if (mined && mined.blockNumber != null) { return; }
                            }

                            // First time scanning. We start a little earlier for some
                            // wiggle room here to handle the eventually consistent nature
                            // of blockchain (e.g. the getTransactionCount was for a
                            // different block)
                            if (scannedBlock == null) {
                                scannedBlock = lastBlockNumber - 3;
                                if (scannedBlock < replaceable.startBlock) {
                                    scannedBlock = replaceable.startBlock;
                                }
                            }

                            while (scannedBlock <= blockNumber) {
                                if (done) { return; }

                                const block = await this.getBlockWithTransactions(scannedBlock);
                                for (let ti = 0; ti < block.transactions.length; ti++) {
                                    const tx = block.transactions[ti];

                                    // Successfully mined!
                                    if (tx.hash === transactionHash) { return; }

                                    // Matches our transaction from and nonce; its a replacement
                                    if (tx.from === replaceable.from && tx.nonce === replaceable.nonce) {
                                        if (done) { return; }

                                        // Get the receipt of the replacement
                                        const receipt = await this.waitForTransaction(tx.hash, confirmations);

                                        // Already resolved or rejected (prolly a timeout)
                                        if (alreadyDone()) { return; }

                                        // The reason we were replaced
                                        let reason = "replaced";
                                        if (tx.data === replaceable.data && tx.to === replaceable.to && tx.value.eq(replaceable.value)) {
                                            reason = "repriced";
                                        } else  if (tx.data === "0x" && tx.from === tx.to && tx.value.isZero()) {
                                            reason = "cancelled"
                                        }

                                        // Explain why we were replaced
                                        reject(logger.makeError("transaction was replaced", Logger.errors.TRANSACTION_REPLACED, {
                                            cancelled: (reason === "replaced" || reason === "cancelled"),
                                            reason,
                                            replacement: this._wrapTransaction(tx),
                                            hash: transactionHash,
                                            receipt
                                        }));

                                        return;
                                    }
                                }
                                scannedBlock++;
                            }
                        }

                        if (done) { return; }
                        this.once("block", replaceHandler);

                    }, (error) => {
                        if (done) { return; }
                        this.once("block", replaceHandler);
                    });
                };

                if (done) { return; }
                this.once("block", replaceHandler);

                cancelFuncs.push(() => {
                    this.removeListener("block", replaceHandler);
                });
            }

            if (typeof(timeout) === "number" && timeout > 0) {
                const timer = setTimeout(() => {
                    if (alreadyDone()) { return; }
                    reject(logger.makeError("timeout exceeded", Logger.errors.TIMEOUT, { timeout: timeout }));
                }, timeout);
                if (timer.unref) { timer.unref(); }

                cancelFuncs.push(() => { clearTimeout(timer); });
            }
        });
    }

    async getBlockNumber(): Promise<number> {
        return this._getInternalBlockNumber(0);
    }

    async getGasPrice(): Promise<BigNumber> {
        await this.getNetwork();

        const result = await this.perform("getGasPrice", { });
        try {
            return BigNumber.from(result);
        } catch (error) {
            return logger.throwError("bad result from backend", Logger.errors.SERVER_ERROR, {
                method: "getGasPrice",
                result, error
            });
        }
    }

    async getBalance(addressOrName: string | Promise<string>, blockTag?: BlockTag | Promise<BlockTag>): Promise<BigNumber> {
        await this.getNetwork();
        const params = await resolveProperties({
            address: this._getAddress(addressOrName),
            blockTag: this._getBlockTag(blockTag)
        });

        const result = await this.perform("getBalance", params);
        try {
            return BigNumber.from(result);
        } catch (error) {
            return logger.throwError("bad result from backend", Logger.errors.SERVER_ERROR, {
                method: "getBalance",
                params, result, error
            });
        }
    }

    async getTransactionCount(addressOrName: string | Promise<string>, blockTag?: BlockTag | Promise<BlockTag>): Promise<number> {
        await this.getNetwork();
        const params = await resolveProperties({
            address: this._getAddress(addressOrName),
            blockTag: this._getBlockTag(blockTag)
        });

        const result = await this.perform("getTransactionCount", params);
        try {
            return BigNumber.from(result).toNumber();
        } catch (error) {
            return logger.throwError("bad result from backend", Logger.errors.SERVER_ERROR, {
                method: "getTransactionCount",
                params, result, error
            });
        }
    }

    async getCode(addressOrName: string | Promise<string>, blockTag?: BlockTag | Promise<BlockTag>): Promise<string> {
        await this.getNetwork();
        const params = await resolveProperties({
            address: this._getAddress(addressOrName),
            blockTag: this._getBlockTag(blockTag)
        });

        const result = await this.perform("getCode", params);
        try {
            return hexlify(result);
        } catch (error) {
            return logger.throwError("bad result from backend", Logger.errors.SERVER_ERROR, {
                method: "getCode",
                params, result, error
            });
        }
    }

    async getStorageAt(addressOrName: string | Promise<string>, position: BigNumberish | Promise<BigNumberish>, blockTag?: BlockTag | Promise<BlockTag>): Promise<string> {
        await this.getNetwork();
        const params = await resolveProperties({
            address: this._getAddress(addressOrName),
            blockTag: this._getBlockTag(blockTag),
            position: Promise.resolve(position).then((p) => hexValue(p))
        });
        const result = await this.perform("getStorageAt", params);
        try {
            return hexlify(result);
        } catch (error) {
            return logger.throwError("bad result from backend", Logger.errors.SERVER_ERROR, {
                method: "getStorageAt",
                params, result, error
            });
        }
    }

    // This should be called by any subclass wrapping a TransactionResponse
    _wrapTransaction(tx: Transaction, hash?: string, startBlock?: number): TransactionResponse {
        if (hash != null && hexDataLength(hash) !== 32) { throw new Error("invalid response - sendTransaction"); }

        const result = <TransactionResponse>tx;

        // Check the hash we expect is the same as the hash the server reported
        if (hash != null && tx.hash !== hash) {
            logger.throwError("Transaction hash mismatch from Provider.sendTransaction.", Logger.errors.UNKNOWN_ERROR, { expectedHash: tx.hash, returnedHash: hash });
        }

        result.wait = async (confirms?: number, timeout?: number) => {
            if (confirms == null) { confirms = 1; }
            if (timeout == null) { timeout = 0; }

            // Get the details to detect replacement
            let replacement = undefined;
            if (confirms !== 0 && startBlock != null) {
                replacement = {
                    data: tx.data,
                    from: tx.from,
                    nonce: tx.nonce,
                    to: tx.to,
                    value: tx.value,
                    startBlock
                };
            }

            const receipt = await this._waitForTransaction(tx.hash, confirms, timeout, replacement);
            if (receipt == null && confirms === 0) { return null; }

            // No longer pending, allow the polling loop to garbage collect this
            this._emitted["t:" + tx.hash] = receipt.blockNumber;

            if (receipt.status === 0) {
                logger.throwError("transaction failed", Logger.errors.CALL_EXCEPTION, {
                    transactionHash: tx.hash,
                    transaction: tx,
                    receipt: receipt
                });
            }
            return receipt;
        };

        return result;
    }

    async sendTransaction(signedTransaction: string | Promise<string>): Promise<TransactionResponse> {
        await this.getNetwork();
        const hexTx = await Promise.resolve(signedTransaction).then(t => hexlify(t));
        const tx = this.formatter.transaction(signedTransaction);
        if (tx.confirmations == null) { tx.confirmations = 0; }
        const blockNumber = await this._getInternalBlockNumber(100 + 2 * this.pollingInterval);
        try {
            const hash = await this.perform("sendTransaction", { signedTransaction: hexTx });
            return this._wrapTransaction(tx, hash, blockNumber);
        } catch (error) {
            (<any>error).transaction = tx;
            (<any>error).transactionHash = tx.hash;
            throw error;
        }
    }

    async _getTransactionRequest(transaction: Deferrable<TransactionRequest>): Promise<Transaction> {
        const values: any = await transaction;

        const tx: any = { };

        ["from", "to"].forEach((key) => {
            if (values[key] == null) { return; }
            tx[key] = Promise.resolve(values[key]).then((v) => (v ? this._getAddress(v): null))
        });

        ["gasLimit", "gasPrice", "maxFeePerGas", "maxPriorityFeePerGas", "value"].forEach((key) => {
            if (values[key] == null) { return; }
            tx[key] = Promise.resolve(values[key]).then((v) => (v ? BigNumber.from(v): null));
        });

        ["type"].forEach((key) => {
            if (values[key] == null) { return; }
            tx[key] = Promise.resolve(values[key]).then((v) => ((v != null) ? v: null));
        });

        if (values.accessList) {
            tx.accessList = this.formatter.accessList(values.accessList);
        }

        ["data"].forEach((key) => {
            if (values[key] == null) { return; }
            tx[key] = Promise.resolve(values[key]).then((v) => (v ? hexlify(v): null));
        });

        return this.formatter.transactionRequest(await resolveProperties(tx));
    }

    async _getFilter(filter: Filter | FilterByBlockHash | Promise<Filter | FilterByBlockHash>): Promise<Filter | FilterByBlockHash> {
        filter = await filter;

        const result: any = { };

        if (filter.address != null) {
            result.address = this._getAddress(filter.address);
        }

        ["blockHash", "topics"].forEach((key) => {
            if ((<any>filter)[key] == null) { return; }
            result[key] = (<any>filter)[key];
        });

        ["fromBlock", "toBlock"].forEach((key) => {
            if ((<any>filter)[key] == null) { return; }
            result[key] = this._getBlockTag((<any>filter)[key]);
        });

        return this.formatter.filter(await resolveProperties(result));
    }

    async _call(transaction: TransactionRequest, blockTag: BlockTag, attempt: number): Promise<string> {
        if (attempt >= MAX_CCIP_REDIRECTS) {
            logger.throwError("CCIP read exceeded maximum redirections", Logger.errors.SERVER_ERROR, {
                redirects: attempt, transaction
            });
        }

        const txSender = transaction.to;

        const result = await this.perform("call", { transaction, blockTag });

        // CCIP Read request via OffchainLookup(address,string[],bytes,bytes4,bytes)
        if (attempt >= 0 && blockTag === "latest" && txSender != null && result.substring(0, 10) === "0x556f1830" && (hexDataLength(result) % 32 === 4)) {
            try {
                const data = hexDataSlice(result, 4);

                // Check the sender of the OffchainLookup matches the transaction
                const sender = hexDataSlice(data, 0, 32);
                if (!BigNumber.from(sender).eq(txSender)) {
                    logger.throwError("CCIP Read sender did not match", Logger.errors.CALL_EXCEPTION, {
                        name: "OffchainLookup",
                        signature: "OffchainLookup(address,string[],bytes,bytes4,bytes)",
                        transaction, data: result
                    });
                }

                // Read the URLs from the response
                const urls: Array<string> = [];
                const urlsOffset = BigNumber.from(hexDataSlice(data, 32, 64)).toNumber();
                const urlsLength = BigNumber.from(hexDataSlice(data, urlsOffset, urlsOffset + 32)).toNumber();
                const urlsData = hexDataSlice(data, urlsOffset + 32);
                for (let u = 0; u < urlsLength; u++) {
                    const url = _parseString(urlsData, u * 32);
                    if (url == null) {
                        logger.throwError("CCIP Read contained corrupt URL string", Logger.errors.CALL_EXCEPTION, {
                            name: "OffchainLookup",
                            signature: "OffchainLookup(address,string[],bytes,bytes4,bytes)",
                            transaction, data: result
                        });
                    }
                    urls.push(url);
                }

                // Get the CCIP calldata to forward
                const calldata = _parseBytes(data, 64);

                // Get the callbackSelector (bytes4)
                if (!BigNumber.from(hexDataSlice(data, 100, 128)).isZero()) {
                    logger.throwError("CCIP Read callback selector included junk", Logger.errors.CALL_EXCEPTION, {
                        name: "OffchainLookup",
                        signature: "OffchainLookup(address,string[],bytes,bytes4,bytes)",
                        transaction, data: result
                    });
                }
                const callbackSelector = hexDataSlice(data, 96, 100);

                // Get the extra data to send back to the contract as context
                const extraData = _parseBytes(data, 128);

                const ccipResult = await this.ccipReadFetch(<Transaction>transaction, calldata, urls);
                if (ccipResult == null) {
                    logger.throwError("CCIP Read disabled or provided no URLs", Logger.errors.CALL_EXCEPTION, {
                        name: "OffchainLookup",
                        signature: "OffchainLookup(address,string[],bytes,bytes4,bytes)",
                        transaction, data: result
                    });
                }

                const tx = {
                    to: txSender,
                    data: hexConcat([ callbackSelector, encodeBytes([ ccipResult, extraData ]) ])
                };

                return this._call(tx, blockTag, attempt + 1);

            } catch (error) {
                if (error.code === Logger.errors.SERVER_ERROR) { throw error; }
            }
        }

        try {
            return hexlify(result);
        } catch (error) {
            return logger.throwError("bad result from backend", Logger.errors.SERVER_ERROR, {
                method: "call",
                params: { transaction, blockTag }, result, error
            });
        }

    }

    async call(transaction: Deferrable<TransactionRequest>, blockTag?: BlockTag | Promise<BlockTag>): Promise<string> {
        await this.getNetwork();
        const resolved = await resolveProperties({
            transaction: this._getTransactionRequest(transaction),
            blockTag: this._getBlockTag(blockTag),
            ccipReadEnabled: Promise.resolve(transaction.ccipReadEnabled)
        });
        return this._call(resolved.transaction, resolved.blockTag, resolved.ccipReadEnabled ? 0: -1);
    }

    async estimateGas(transaction: Deferrable<TransactionRequest>): Promise<BigNumber> {
        await this.getNetwork();
        const params = await resolveProperties({
            transaction: this._getTransactionRequest(transaction)
        });

        const result = await this.perform("estimateGas", params);
        try {
            return BigNumber.from(result);
        } catch (error) {
            return logger.throwError("bad result from backend", Logger.errors.SERVER_ERROR, {
                method: "estimateGas",
                params, result, error
            });
        }
    }

    async _getAddress(addressOrName: string | Promise<string>): Promise<string> {
        addressOrName = await addressOrName;
        if (typeof(addressOrName) !== "string") {
            logger.throwArgumentError("invalid address or ENS name", "name", addressOrName);
        }

        const address = await this.resolveName(addressOrName);
        if (address == null) {
            logger.throwError("ENS name not configured", Logger.errors.UNSUPPORTED_OPERATION, {
                operation: `resolveName(${ JSON.stringify(addressOrName) })`
            });
        }
        return address;
    }

    async _getBlock(blockHashOrBlockTag: BlockTag | string | Promise<BlockTag | string>, includeTransactions?: boolean): Promise<Block | BlockWithTransactions> {
        await this.getNetwork();

        blockHashOrBlockTag = await blockHashOrBlockTag;

        // If blockTag is a number (not "latest", etc), this is the block number
        let blockNumber = -128;

        const params: { [key: string]: any } = {
            includeTransactions: !!includeTransactions
        };

        if (isHexString(blockHashOrBlockTag, 32)) {
            params.blockHash = blockHashOrBlockTag;
        } else {
            try {
                params.blockTag = await this._getBlockTag(blockHashOrBlockTag);
                if (isHexString(params.blockTag)) {
                    blockNumber = parseInt(params.blockTag.substring(2), 16);
                }
            } catch (error) {
                logger.throwArgumentError("invalid block hash or block tag", "blockHashOrBlockTag", blockHashOrBlockTag);
            }
        }

        return poll(async () => {
            const block = await this.perform("getBlock", params);

            // Block was not found
            if (block == null) {

                // For blockhashes, if we didn't say it existed, that blockhash may
                // not exist. If we did see it though, perhaps from a log, we know
                // it exists, and this node is just not caught up yet.
                if (params.blockHash != null) {
                    if (this._emitted["b:" + params.blockHash] == null) { return null; }
                }

                // For block tags, if we are asking for a future block, we return null
                if (params.blockTag != null) {
                    if (blockNumber > this._emitted.block) { return null; }
                }

                // Retry on the next block
                return undefined;
            }

            // Add transactions
            if (includeTransactions) {
                let blockNumber: number = null;
                for (let i = 0; i < block.transactions.length; i++) {
                    const tx = block.transactions[i];
                    if (tx.blockNumber == null) {
                        tx.confirmations = 0;

                    } else if (tx.confirmations == null) {
                        if (blockNumber == null) {
                            blockNumber = await this._getInternalBlockNumber(100 + 2 * this.pollingInterval);
                        }

                        // Add the confirmations using the fast block number (pessimistic)
                        let confirmations = (blockNumber - tx.blockNumber) + 1;
                        if (confirmations <= 0) { confirmations = 1; }
                        tx.confirmations = confirmations;
                    }
                }

                const blockWithTxs: any = this.formatter.blockWithTransactions(block);
                blockWithTxs.transactions = blockWithTxs.transactions.map((tx: TransactionResponse) => this._wrapTransaction(tx));
                return blockWithTxs;
            }

            return this.formatter.block(block);

        }, { oncePoll: this });
    }

    getBlock(blockHashOrBlockTag: BlockTag | string | Promise<BlockTag | string>): Promise<Block> {
        return <Promise<Block>>(this._getBlock(blockHashOrBlockTag, false));
    }

    getBlockWithTransactions(blockHashOrBlockTag: BlockTag | string | Promise<BlockTag | string>): Promise<BlockWithTransactions> {
        return <Promise<BlockWithTransactions>>(this._getBlock(blockHashOrBlockTag, true));
    }

    async getTransaction(transactionHash: string | Promise<string>): Promise<TransactionResponse> {
        await this.getNetwork();
        transactionHash = await transactionHash;

        const params = { transactionHash: this.formatter.hash(transactionHash, true) };

        return poll(async () => {
            const result = await this.perform("getTransaction", params);

            if (result == null) {
                if (this._emitted["t:" + transactionHash] == null) {
                    return null;
                }
                return undefined;
            }

            const tx = this.formatter.transactionResponse(result);

            if (tx.blockNumber == null) {
                tx.confirmations = 0;

            } else if (tx.confirmations == null) {
                const blockNumber = await this._getInternalBlockNumber(100 + 2 * this.pollingInterval);

                // Add the confirmations using the fast block number (pessimistic)
                let confirmations = (blockNumber - tx.blockNumber) + 1;
                if (confirmations <= 0) { confirmations = 1; }
                tx.confirmations = confirmations;
            }

            return this._wrapTransaction(tx);
        }, { oncePoll: this });
    }

    async getTransactionReceipt(transactionHash: string | Promise<string>): Promise<TransactionReceipt> {
        await this.getNetwork();

        transactionHash = await transactionHash;

        const params = { transactionHash: this.formatter.hash(transactionHash, true) };

        return poll(async () => {
            const result = await this.perform("getTransactionReceipt", params);

            if (result == null) {
                if (this._emitted["t:" + transactionHash] == null) {
                    return null;
                }
                return undefined;
            }

            // "geth-etc" returns receipts before they are ready
            if (result.blockHash == null) { return undefined; }

            const receipt = this.formatter.receipt(result);

            if (receipt.blockNumber == null) {
                receipt.confirmations = 0;

            } else if (receipt.confirmations == null) {
                const blockNumber = await this._getInternalBlockNumber(100 + 2 * this.pollingInterval);

                // Add the confirmations using the fast block number (pessimistic)
                let confirmations = (blockNumber - receipt.blockNumber) + 1;
                if (confirmations <= 0) { confirmations = 1; }
                receipt.confirmations = confirmations;
            }

            return receipt;
        }, { oncePoll: this });
    }

    async getLogs(filter: Filter | FilterByBlockHash | Promise<Filter | FilterByBlockHash>): Promise<Array<Log>> {
        await this.getNetwork();
        const params = await resolveProperties({ filter: this._getFilter(filter) });
        const logs: Array<Log> = await this.perform("getLogs", params);
        logs.forEach((log) => {
            if (log.removed == null) { log.removed = false; }
        });
        return Formatter.arrayOf(this.formatter.filterLog.bind(this.formatter))(logs);
    }

    async getEtherPrice(): Promise<number> {
        await this.getNetwork();
        return this.perform("getEtherPrice", { });
    }

    async _getBlockTag(blockTag: BlockTag | Promise<BlockTag>): Promise<BlockTag> {
        blockTag = await blockTag;

        if (typeof(blockTag) === "number" && blockTag < 0) {
            if (blockTag % 1) {
                logger.throwArgumentError("invalid BlockTag", "blockTag", blockTag);
            }

            let blockNumber = await this._getInternalBlockNumber(100 + 2 * this.pollingInterval);
            blockNumber += blockTag;
            if (blockNumber < 0) { blockNumber = 0; }
            return this.formatter.blockTag(blockNumber)
        }

        return this.formatter.blockTag(blockTag);
    }


    async getResolver(name: string): Promise<null | Resolver> {
        let currentName = name;
        while (true) {
            if (currentName === "" || currentName === ".") { return null; }

            // Optimization since the eth node cannot change and does
            // not have a wildcard resolver
            if (name !== "eth" && currentName === "eth") { return null; }

            // Check the current node for a resolver
            const addr = await this._getResolver(currentName, "getResolver");

            // Found a resolver!
            if (addr != null) {
                const resolver = new Resolver(this, addr, name);

                // Legacy resolver found, using EIP-2544 so it isn't safe to use
                if (currentName !== name && !(await resolver.supportsWildcard())) { return null; }

                return resolver;
            }

            // Get the parent node
            currentName = currentName.split(".").slice(1).join(".");
        }

    }

    async _getResolver(name: string, operation?: string): Promise<string> {
        if (operation == null) { operation = "ENS"; }

        const network = await this.getNetwork();

        // No ENS...
        if (!network.ensAddress) {
            logger.throwError(
                "network does not support ENS",
                Logger.errors.UNSUPPORTED_OPERATION,
                { operation, network: network.name }
            );
        }

        try {
            // keccak256("resolver(bytes32)")
            const addrData = await this.call({
                to: network.ensAddress,
                data: ("0x0178b8bf" + namehash(name).substring(2))
            });
            return this.formatter.callAddress(addrData);
        } catch (error) {
            // ENS registry cannot throw errors on resolver(bytes32)
        }

        return null;
    }

    async resolveName(name: string | Promise<string>): Promise<null | string> {
        name = await name;

        // If it is already an address, nothing to resolve
        try {
            return Promise.resolve(this.formatter.address(name));
        } catch (error) {
            // If is is a hexstring, the address is bad (See #694)
            if (isHexString(name)) { throw error; }
        }

        if (typeof(name) !== "string") {
            logger.throwArgumentError("invalid ENS name", "name", name);
        }

        // Get the addr from the resolver
        const resolver = await this.getResolver(name);
        if (!resolver) { return null; }

        return await resolver.getAddress();
    }

    async lookupAddress(address: string | Promise<string>): Promise<null | string> {
        address = await address;
        address = this.formatter.address(address);

        const node = address.substring(2).toLowerCase() + ".addr.reverse";

        const resolverAddr = await this._getResolver(node, "lookupAddress");
        if (resolverAddr == null) { return null; }

        // keccak("name(bytes32)")
        const name = _parseString(await this.call({
            to: resolverAddr,
            data: ("0x691f3431" + namehash(node).substring(2))
        }), 0);

        const addr = await this.resolveName(name);
        if (addr != address) { return null; }

        return name;
    }

    async getAvatar(nameOrAddress: string): Promise<null | string> {
        let resolver: Resolver = null;
        if (isHexString(nameOrAddress)) {
            // Address; reverse lookup
            const address = this.formatter.address(nameOrAddress);

            const node = address.substring(2).toLowerCase() + ".addr.reverse";

            const resolverAddress = await this._getResolver(node, "getAvatar");
            if (!resolverAddress) { return null; }

            // Try resolving the avatar against the addr.reverse resolver
            resolver = new Resolver(this, resolverAddress, node);
            try {
                const avatar = await resolver.getAvatar();
                if (avatar) { return avatar.url; }
            } catch (error) {
                if (error.code !== Logger.errors.CALL_EXCEPTION) { throw error; }
            }

            // Try getting the name and performing forward lookup; allowing wildcards
            try {
                // keccak("name(bytes32)")
                const name = _parseString(await this.call({
                    to: resolverAddress,
                    data: ("0x691f3431" + namehash(node).substring(2))
                }), 0);
                resolver = await this.getResolver(name);
            } catch (error) {
                if (error.code !== Logger.errors.CALL_EXCEPTION) { throw error; }
                return null;
            }

        } else {
            // ENS name; forward lookup with wildcard
            resolver = await this.getResolver(nameOrAddress);
            if (!resolver) { return null; }
        }

        const avatar = await resolver.getAvatar();
        if (avatar == null) { return null; }

        return avatar.url;
    }

    perform(method: string, params: any): Promise<any> {
        return logger.throwError(method + " not implemented", Logger.errors.NOT_IMPLEMENTED, { operation: method });
    }

    _startEvent(event: Event): void {
        this.polling = (this._events.filter((e) => e.pollable()).length > 0);
    }

    _stopEvent(event: Event): void {
        this.polling = (this._events.filter((e) => e.pollable()).length > 0);
    }

    _addEventListener(eventName: EventType, listener: Listener, once: boolean): this {
        const event = new Event(getEventTag(eventName), listener, once)
        this._events.push(event);
        this._startEvent(event);

        return this;
    }

    on(eventName: EventType, listener: Listener): this {
        return this._addEventListener(eventName, listener, false);
    }

    once(eventName: EventType, listener: Listener): this {
        return this._addEventListener(eventName, listener, true);
    }


    emit(eventName: EventType, ...args: Array<any>): boolean {
        let result = false;

        let stopped: Array<Event> = [ ];

        let eventTag = getEventTag(eventName);
        this._events = this._events.filter((event) => {
            if (event.tag !== eventTag) { return true; }

            setTimeout(() => {
                event.listener.apply(this, args);
            }, 0);

            result = true;

            if (event.once) {
                stopped.push(event);
                return false;
            }

            return true;
        });

        stopped.forEach((event) => { this._stopEvent(event); });

        return result;
    }

    listenerCount(eventName?: EventType): number {
        if (!eventName) { return this._events.length; }

        let eventTag = getEventTag(eventName);
        return this._events.filter((event) => {
            return (event.tag === eventTag);
        }).length;
    }

    listeners(eventName?: EventType): Array<Listener> {
        if (eventName == null) {
            return this._events.map((event) => event.listener);
        }

        let eventTag = getEventTag(eventName);
        return this._events
            .filter((event) => (event.tag === eventTag))
            .map((event) => event.listener);
    }

    off(eventName: EventType, listener?: Listener): this {
        if (listener == null) {
            return this.removeAllListeners(eventName);
        }

        const stopped: Array<Event> = [ ];

        let found = false;

        let eventTag = getEventTag(eventName);
        this._events = this._events.filter((event) => {
            if (event.tag !== eventTag || event.listener != listener) { return true; }
            if (found) { return true; }
            found = true;
            stopped.push(event);
            return false;
        });

        stopped.forEach((event) => { this._stopEvent(event); });

        return this;
    }

    removeAllListeners(eventName?: EventType): this {
        let stopped: Array<Event> = [ ];
        if (eventName == null) {
            stopped = this._events;

            this._events = [ ];
        } else {
            const eventTag = getEventTag(eventName);
            this._events = this._events.filter((event) => {
                if (event.tag !== eventTag) { return true; }
                stopped.push(event);
                return false;
            });
        }

        stopped.forEach((event) => { this._stopEvent(event); });

        return this;
    }
}