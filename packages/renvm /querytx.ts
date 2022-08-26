import { axios } from "axios"


const generatePayload = (method: string, params?: unknown) => ({
    id: 1,
    jsonrpc: "2.0",
    method,
    params,
});
const payload = generatePayload("ren_queryTx", request);

// request is called with provider

const response = axios.post("https://rpc.renproject.io", payload, 120000);

// asset = BTC or ZEC
// toChain = "Ethereum"
//  selector = `{asset}/to{toChain}`
const  selector = `BTC/toEthereum`

//In renvmTxSubmitter
const expectedHash = utils.toURLBase64(
    generateTransactionHash("1", selector, tx.in),
);

/* Start with these inputs in transferRequest

const result = renVM.withChains(eth).gateway({
    asset: this._getRemoteChainName(),        this is BTC or ZEC
    from: this._getRemoteChain().GatewayAddress(),   this has the chain prop and type prop
    to: eth.Contract(this._getContractParams()),        this is what is seen below
    nonce: arrayify(this.nonce),
  }); 
  
  to =
   chain: this.chain,
            type: "contract",
            params: {
                to,
                method: params.method,
                params: [
                    ...params.params,
                    ...(params.withRenParams
                        ? [
                              {
                                  name: "amount",
                                  type: "uint256",
                                  value: EVMParam.EVM_AMOUNT,
                                  notInPayload: true,
                                  renParam: true,
                              },
                              {
                                  name: "nHash",
                                  type: "bytes32",
                                  value: EVMParam.EVM_NHASH,
                                  notInPayload: true,
                                  renParam: true,
                              },
                              {
                                  name: "signature",
                                  type: "bytes",
                                  value: EVMParam.EVM_SIGNATURE,
                                  notInPayload: true,
                                  renParam: true,
                              },
                          ]
                        : []),
                ],
                txConfig: params.txConfig,
            },
            payloadConfig: params.payloadConfig,
        };
  */

/* this all is created from the inputs in result
Need these things for tx.in as specified in txSubmitter

txid: utils.toURLBase64(params.txid),
txindex: params.txindex.toFixed(),
amount: params.amount.toFixed(),
payload: utils.toURLBase64(params.payload),
phash: utils.toURLBase64(params.phash),
to: params.to,
nonce: utils.toURLBase64(params.nonce),
nhash: utils.toURLBase64(params.nhash),
gpubkey: utils.toURLBase64(params.gpubkey),
ghash: utils.toURLBase64(params.ghash), */

// below gets txid, txindex

try {
    const txs = await utils.tryNTimes(
        async () => this.api.fetchTXs(address),
        2,
    );
    txs.map((tx) =>
        onInput({
            chain: this.chain,
            txid: utils.toURLBase64(utils.fromHex(tx.txid).reverse()),
            txHash: tx.txid,
            txindex: tx.txindex,
            explorerLink:
                this.transactionExplorerLink({
                    txHash: tx.txid,
                }) || "",

            asset,
            amount: tx.amount,
        }),
    );
} catch (error: unknown) {
    // Ignore error and fallback to getUTXOs.
}

while (true) {
    if (listenerCancelled()) {
        return;
    }
    try {
        const utxos = await this.api.fetchUTXOs(address);
        utxos.map((tx) =>
            onInput({
                chain: this.chain,
                txid: utils.toURLBase64(
                    utils.fromHex(tx.txid).reverse(),
                ),
                txHash: tx.txid,
                txindex: tx.txindex,
                explorerLink:
                    this.transactionExplorerLink({
                        txHash: tx.txid,
                    }) || "",

                asset,
                amount: tx.amount,
            }),
        );
    } catch (error: unknown) {
        console.error(error);
    }
    await utils.sleep(15 * utils.sleep.SECONDS);
}

// what is passed to construct Bitcoin

const BitcoinMainnet: BitcoinNetworkConfig = {
    label: "Bitcoin",

    selector: "Bitcoin",

    nativeAsset: {
        name: "Bitcoin",
        symbol: "BTC",
        decimals: 8,
    },
    averageConfirmationTime: 60 * 10,

    explorer: StandardBitcoinExplorer("https://live.blockcypher.com/btc/"),
    p2shPrefix: new Uint8Array([0x05]),
    providers: [
        new Blockstream(),
        new Blockchair(),
        { api: new SoChain(), priority: 15 },
        { api: new Blockchain(BlockchainNetwork.Bitcoin), priority: 20 },
    ],
    // validateAddress: (address: string) =>
    //     validateAddress(address, "BTC", "mainnet"),
};
// what is passed to construct Ethereum
const configMap: EthereumBaseChain["configMap"] = {
    [RenNetwork.Mainnet]: {
        selector: "Ethereum",

        nativeAsset: { name: "Ether", symbol: "ETH", decimals: 18 },
        averageConfirmationTime: 15,

        config: {
            chainId: "0x1",
            chainName: "Ethereum Mainnet",
            nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
            rpcUrls: [
                "https://cloudflare-eth.com",
                "https://mainnet.infura.io/v3/${INFURA_API_KEY}",
                "wss://mainnet.infura.io/ws/v3/${INFURA_API_KEY}",
                "https://api.mycryptoapi.com/eth",
            ],
            blockExplorerUrls: ["https://etherscan.io"],
        },

        addresses: {
            GatewayRegistry: "0xf36666C230Fa12333579b9Bd6196CB634D6BC506",
            BasicBridge: "0x82DF02A52E2e76C0c233367f2fE6c9cfe51578c5",
        },
    },
}

export const GET = async <T = unknown, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>,
): Promise<T> => {
    try {
        const response = await Axios.get<T>(url, {
            timeout: DEFAULT_TIMEOUT,
            ...config,
        });

        return response.data;
    } catch (error: unknown) {
        throw new Error(extractError(error));
    }
};
//my version
const respons = await axios.get(`https://blockstream.info/api/address/${address}/txs`);
respons.data;

// ^put this as const response below

export interface UTXO {
    txid: string;
    txindex: string;
    amount: string;
    height: string | null;
}
// ^an array of these is returned below

// BlockStream fetchTxs and fetchUtxos
public fetchTXs = async (address: string): Promise<UTXO[]> => {
    const response = await utils.GET<BlockstreamTX[]>(
        this.getAPIUrl(`/address/${address}/txs`),
    );

    const received: UTXO[] = [];

    for (const tx of response) {
        for (let i = 0; i < tx.vout.length; i++) {
            const vout = tx.vout[i];
            if (vout.scriptpubkey_address === address) {
                received.push({
                    txid: tx.txid,
                    amount: vout.value.toString(),
                    txindex: i.toString(),
                    height: tx.status.confirmed
                        ? tx.status.block_height.toString()
                        : null,
                });
            }
        }
    }

    return received.sort(sortUTXOs);
};

public fetchUTXOs = async (address: string): Promise<UTXO[]> => {
    const response = await utils.GET<BlockstreamUTXO[]>(
        this.getAPIUrl(`/address/${address}/utxo`),
    );

    return response
        .map((utxo) => ({
            txid: utxo.txid,
            amount: utxo.value.toString(),
            txindex: utxo.vout.toString(),
            height: utxo.status.confirmed
                ? utxo.status.block_height.toString()
                : null,
        }))
        .sort(sortUTXOs);
};

// Blockchair

public fetchTXs = async (address: string, limit = 25): Promise<UTXO[]> => {
    const url = `${this.endpoint()}/dashboards/address/${address}?limit=${limit},0`;
    const response = await utils.GET<AddressResponse>(url);

    // let latestBlock = response.context.state;
    // if (latestBlock === 0) {
    //     const statsUrl = `${this.endpoint()}/stats`;
    //     const statsResponse = (
    //         await utils.GET(statsUrl)
    //     );
    //     latestBlock = statsResponse.data.blocks - 1;
    // }

    const txHashes = response.data[address].transactions;

    let txDetails: {
        [txHash: string]: TransactionResponse["data"][""];
    } = {};

    // Fetch in sets of 10
    for (let i = 0; i < Math.ceil(txHashes.length / 10); i++) {
        const txUrl = `${this.endpoint()}/dashboards/transactions/${txHashes
            .slice(i * 10, (i + 1) * 10)
            .join(",")}`;
        const txResponse = await utils.GET<TransactionResponse>(txUrl);
        txDetails = {
            ...txDetails,
            ...txResponse.data,
        };
    }

    const received: UTXO[] = [];

    for (const txHash of txHashes) {
        const tx = txDetails[txHash];
        for (let i = 0; i < tx.outputs.length; i++) {
            const output = tx.outputs[i];
            if (output.recipient === address) {
                received.push({
                    txid: tx.transaction.hash,
                    amount: output.value.toString(),
                    txindex: i.toString(),
                    height:
                        output.block_id && output.block_id > 0
                            ? output.block_id.toString()
                            : null,
                });
            }
        }
    }

    return received.sort(sortUTXOs);
};


public fetchUTXOs = async (address: string): Promise<UTXO[]> => {
    const url = `${this.endpoint()}/dashboards/address/${address}?limit=0,100`;
    const response = await utils.GET<AddressResponse>(url);

    let latestBlock = response.context.state;
    if (latestBlock === 0) {
        const statsUrl = `${this.endpoint()}/stats`;
        const statsResponse = await utils.GET<{ data: { blocks: number } }>(
            statsUrl,
        );
        latestBlock = statsResponse.data.blocks - 1;
    }

    return response.data[address].utxo
        .map((utxo) => ({
            txid: utxo.transaction_hash,
            amount: utxo.value.toString(),
            txindex: utxo.index.toString(),
            height:
                utxo.block_id && utxo.block_id > 0
                    ? utxo.block_id.toString()
                    : null,
        }))
        .sort(sortUTXOs);
};

export const toURLBase64 = (input: Uint8Array): string => {
    assertType<Uint8Array>("Uint8Array", {
        input,
    });

    return toBase64(input)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
};

export const fromHex = (hexString: string): Uint8Array => {
    assertType<string>("string", { hex: hexString });

    // Strip "0x" prefix.
    hexString = strip0x(hexString);

    // Pad the hex string.
    if (hexString.length % 2) {
        hexString = "0" + hexString;
    }

    // Split the string into bytes.
    const match = hexString.match(/.{1,2}/g);
    if (!match) {
        return new Uint8Array();
    }

    // Parse each byte and create a Uint8Array.
    return new Uint8Array(match.map((byte) => parseInt(byte, 16)));
};

blockState = await this.queryBlockState(asset, 5);