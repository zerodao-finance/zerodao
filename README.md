# zerodao

Project repository for the zeroDAO codebase, including the production contracts.


## Publishing to NPM

1. Get access to the zerodao organization on [NPM](https://npmjs.com)
2. Generate an access token on NPM
3. Create an `.npmrc` file in the root of this directory
4. Paste the following in that `.npmrc` file with your generated access token:
```
//registry.npmjs.org/:_authToken=<ACCESS-TOKEN>
access=public
```
5. Install [Lerna](https://lerna.js.org/docs/introduction) using `npm i -g lerna`
6. Lastly, publish your changes to NPM using `lerna publish patch`


## SDK

To install to a browser application
```sh
yarn add @zerodao/sdk
```

The primary exports encountered in the library can be accessed and used as follows:

### ZeroP2P

A ZeroP2P instance can be used as an argument to Request#publish to broadcast any one of the derived Request classes

```js

import { ZeroP2P } from "@zerodao/sdk";
import { Wallet } from "@ethersproject/wallet";

(async () => {
  const signer = Wallet.createRandom();
  const peer = await ZeroP2P.fromPassword({
    signer,
    multiaddr: 'mainnet',
    password: await signer.getAddress()
  }); // deterministic libp2p key generation -- only run one peer with the same multiaddr
  await peer.start();
  await peer.subscribeKeepers(); // keepers announce themselves and their multiaddr is stored in the peer._keepers Array
})().catch(console.error);

```

### Request

Abstract class used to derive different types of broadcasts in the protocol. Currently, only TransferRequest and BurnRequest are used. Cannot be instantiated.

```js

import { CONTROLLER_DEPLOYMENTS, Request } from "@zerodao/sdk";

const ethereumControllerAddress = Object.keys(CONTROLLER_DEPLOYMENTS).find((contractAddress) => CONTROLLER_DEPLOYMENTS[contractAddress] === 'Ethereum');

Request.addressToChainId(ethereumControllerAddress) // 1

```

### TransferRequest

Primary class for bridging BTC or ZEC to a host EVM network. Accepts a simple configuration object as an input to its constructor and exposes some methods useful for broadcasting to zeroDAO keepers.

```js
import { FIXTURES, DEPLOYMENTS, TransferRequest, ZeroP2P } from "@zerodao/sdk";
import { Wallet } from "@ethersproject/wallet";
import { parseUnits } from "@ethersproject/units";
import { AddressZero } from "@ethersproject/constants";
import { AbiCoder } from "@ethersproject/abi";
const coder = new AbiCoder();

(async () => {
  const wallet = Wallet.createRandom(); // get a signer object any way necessary
  const peer = await ZeroP2P.fromPassword({
    signer,
    multiaddr: 'mainnet',
    password: await signer.getAddress()
  });
  const chainId = 1;
  const contractAddress = DEPLOYMENTS[chainId].mainnet.contracts.BadgerBridgeZeroController.address;
  const request = new TransferRequest({
    asset: FIXTURES.ETHEREUM.renBTC, // or use renZEC on mainnet
    amount: parseUnits('1', 18) // 1 ETH
    module: AddressZero, // bridge to ETH
    to: await signer.getAddress(),
    data: coder.encode(['uint256'], [ getMinOutForTrade() ]), // ETH module accepts minOut for swapping to ETH, to prevent slippage
    underwriter: contractAddress,
    contractAddress
  });
  console.log(await request.toGatewayAddress());
  await request.publish(peer).toPromise();
})().catch(console.error);

```
    
### BurnRequest

Primary class for releasing funds as BTC or ZEC 

```js

import { FIXTURES, DEPLOYMENTS, TransferRequest, ZeroP2P } from "@zerodao/sdk";
import { Wallet } from "@ethersproject/wallet";
import { parseUnits } from "@ethersproject/units";
import { MaxUint256 } from "@ethersproject/constants";
import { AbiCoder } from "@ethersproject/abi";
const coder = new AbiCoder();

(async () => {
  const signer = Wallet.createRandom(); // get a signer object any way necessary
  const peer = await ZeroP2P.fromPassword({
    signer,
    multiaddr: 'mainnet',
    password: await signer.getAddress()
  });
  const chainId = 1;
  const contractAddress = DEPLOYMENTS[chainId].mainnet.contracts.BadgerBridgeZeroController.address;
  const request = new BurnRequest({
    asset: FIXTURES.ETHEREUM.WBTC, // or use renZEC on mainnet
    owner: await signer.getAddress(),
    amount: parseUnits('1', 8), // 1 WBTC
    data: coder.encode(['uint256'], [ getMinOutForTrade() ]), // WBTC module accepts minOut for swapping to WBTC, to prevent slippage
    contractAddress,
    deadline: MaxUint256 // set an expiry time for ERC20Permit message
  });
  if (await request.needsApproval()) await (await request.approve()).wait();
  await request.sign(signer);
  await request.publish(peer).toPromise();
})().catch(console.error);

```
