import { axios } from "axios"


const generatePayload = (method: string, params?: unknown) => ({
    id: 1,
    jsonrpc: "2.0",
    method,
    params,
});
const payload = generatePayload("ren_queryTx", request);
const response = axios.post("https://rpc.renproject.io", payload, 120000);

// asset = BTC or ZEC
// toChain = "ETH or Ethereum or Mainnet, probably Ethereum"
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

