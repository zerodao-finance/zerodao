import { AbiCoder, Interface } from "@ethersproject/abi";
import constants from "@ethersproject/constants";
import { FIXTURES } from "@zerodao/common";
import { ZeroP2P } from "@zerodao/p2p";
import { CHAINS } from "@zerodao/chains";
import { joinSignature, arrayify, hexlify, splitSignature, hexZeroPad } from "@ethersproject/bytes";
import { Base58 } from "@ethersproject/basex";
import { BigNumber } from "@ethersproject/bignumber";
import { Request } from "./Request";
import { BTCHandler } from "send-crypto/build/main/handlers/BTC/BTCHandler";
import { ZECHandler } from "send-crypto/build/main/handlers/ZEC/ZECHandler";

const coder = new AbiCoder();

const remoteTxMap = new WeakMap();

function minOutFromData(request) {
  return coder.decode(['uint256'], request.data);
};


function getDomainStructure(request) {
          return Number(request.getChainId()) == 137 &&
          getAddress(request.asset) === getAddress(FIXTURES.MATIC.USDC)
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
	    ]
}

function isAsset(assetName, address) {
  return Boolean(Object.keys(FIXTURES).find((network) => getAddress(FIXTURES[network][assetName] === constants.AddressZero.substr(0, 41) + '1') === getAddress(address));
}
  

function isUSDC(asset) {
  return isAsset('USDC', asset);
}

function isWBTC(asset) {
  return isAsset('WBTC', asset);
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
        verifyingContract: this.asset || ethers.constants.AddressZero,
        salt: hexZeroPad(
          BigNumber.from(String(this.getChainId()) || "1").toHexString(),
          32
        ),
      };
    }
    if (chainId === 42161) {
        return {
            name: "USD Coin (Arb1)"
            version: "1",
            chainId: String(chainId)
            verifyingContract: this.asset || ethers.constants.AddressZero,
        };
    }
    return {
      name: "USD Coin",
      version: "2",
      chainId: this.getChainId(),
      verifyingContract: this.asset
    }
  }
  return {
    name: this.tokenName,
    version: '1',
    chainId: String(chainId),
    verifyingContract: this.asset
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
      }
   }

const isZcashAddress = (hex) => Buffer.from(ethers.utils.hexlify(hex).substr(2), 'hex').toString('utf8')[0] === 't';

function getRenAssetName(request) {
    return isZcashAddress(request.destination) ? 'renZEC' : 'renBTC';
}

function toFixtureName(chainId) {
  switch (chainId) {
    case 1:
      return 'ETHEREUM';
    case 137:
      return 'MATIC';
    case 43114:
      return 'AVALANCHE';
    case 42161:
      return 'ARBITRUM';
    case 10:
      return 'OPTIMISM';
  }
}

function getRenAsset(request) {
  const provider = getVanillaProvider(request);
  const address = FIXTURES[toFixtureName(request.getChainId())][getRenAssetName(request)];
  return new ethers.Contract(address, [ "event Transfer(address indexed from, address indexed to, uint256 amount)", ], provider); 
}

export class BurnRequest {
  public asset: string;
  public data: string;
  public owner: string;
  public destination: string;
  public deadline: Bignumberish;
  public amount: Bignumberish;
  public contractAddress: string;
  public nonce: Bignumberish;
  public tokenName: string;
  static get PROTOCOL() {
    return '/zero/1.1.0/dispatch';
  }
  constructor({
    asset: string,
    data: string,
    owner: string,
    destination: string,
    deadline: Bignumberish,
    amount: Bignumberish,
    contractAddress: string
  }) {
    this.asset = asset;
    this.data = data;
    this.owner = owner;
    this.destination = destination;
    this.deadline = deadline;
    this.amount = amount;
    this.contractAddress = contractAddress;
  }
  async sendTransaction(signer) {
    const { contractAddress, amount, destination, minOut } = this;
    const contract = new ethers.Contract(
      this.contractAddress,
      ["function burnApproved(address, address, uint256, uint256, bytes) payable"],
      signer
    );
    const tx = await contract.burnApproved(constants.AddressZero, this.asset, this.isNative() ? '0' : this.amount, minOutFromData(this), this.destination, this.isNative() ? { value: this.amount } : {})
    remoteTxMap.set(this, tx.wait());
  }
  serialize(): Buffer {
    return Buffer.from(JSON.stringify({
      asset: this.asset,
      data: this.data,
      owner: this.owner,
      destination: this.destination,
      deadline: this.deadline,
      amount: this.amount,
      contractAddress: this.contractAddress
    }));
  }
  isNative() {
    return this.asset === constants.AddressZero;
  }
  toEIP712() {
    return {
      types: {
        EIP712Domain: getDomainStructure(this),
	Permit: getPermitStructure(this)
      },
      primaryType: "Permit",
      domain: getDomain(this),
      message: getMessage(this)
    };
  }
  getExpiry() {
    return keccak256(
      ["address", "uint256", "uint256", "uint256", "bytes", "bytes"],
      [
        this.asset,
        this.amount,
        this.deadline,
        this.nonce,
        this.data,
        this.destination,
      ]
    );
  }
  async waitForHostTransaction() {
    const receiptPromise = remoteETHTxMap.get(this);
    if (receiptPromise) return await receiptPromise;
    return await new Promise((resolve, reject) => {
      const renAsset = getRenAsset(this);
      const filter = renAsset.filters.Transfer(
        this.contractAddress,
        constants.AddressZero
      );
      const done = (rcpt) => {
        renAsset.off(filter, listener);
        resolve(rcpt);
      };
      const listener = (from, to, amount, evt) => {
        (async () => {
          if (this.asset == ethers.constants.AddressZero) {
            const tx = await evt.getTransaction();
            if (
              tx.from === this.owner &&
              ethers.utils.hexlify(tx.value) ===
                ethers.utils.hexlify(this.amount)
            )
              return done(await evt.getTransactionReceipt());
          } else {
            const receipt = await evt.getTransactionReceipt();
            const { logs } = await evt.getTransactionReceipt();
            const decoded = logs
              .map((v) => {
                try {
                  return renAsset.interface.parseLog(v);
                } catch (e) {
                  console.error(e);
                }
              })
              .filter(Boolean);
            const events = logs.map((v, i) => ({ log: v, event: decoded[i] }));
            console.log("events", events);
            if (
              events.find(
                (v) =>
                  v.event.args.from.toLowerCase() ===
                    this.owner.toLowerCase() &&
                  ethers.utils.hexlify(this.amount) ===
                    ethers.utils.hexlify(
                      (v.event.args && v.event.args.amount) || 0
                    )
              )
            )
            return done(receipt);
          }
        })().catch((err) => console.error(err));
      };
      renAsset.on(filter, listener);
    });
  }
  getHandlerForDestinationChain() {
    return isZcashAddress(this.destination) ? ZECHandler : BTCHandler;
  }
  getNormalizedDestinationAddress() {
    if (isZcashAddress(this.destination)) return Buffer.from(hexlify(this.destination).substr(2), 'hex').toString('utf8'); // implement zcash encoding here
    const arrayed = Array.from(arrayify(this.destination));
    let address;
    if (arrayed.length > 40) address = Buffer.from(arrayed).toString("utf8");
    else address = Base58.encode(this.destination);
    return address;
  }
  async waitForRemoteTransaction() {
    const { length } = await (this.getHandlerForDestinationChain()).getUTXOs(false, {
      address: this.getNormalizedDestinationAddress(),
      confirmations: 0,
    });
    while (true) {
      try {
        const utxos = await (this.getHandlerForDestinationChain()).getUTXOs(false, {
          address: this.getNormalizedDestinationAddress(),
          confirmations: 0,
        });
        if (utxos.length > length) return utxos[utxos.length - 1];
      } catch (e) {
        console.error(e);
      }
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
  async sign(signer) {
    if (this.isNative()) throw Error("BurnRequest#sign(): can't sign transaction for ETH");
    if (!this.nonce || !this.tokenName) await this.fetchData();
    try {
      const payload = this.toEIP712();
      delete payload.types.EIP712Domain;
      const sig = await signer._signTypedData(
        payload.domain,
        payload.types,
        payload.message
      );
      return (this.signature = joinSignature(
        splitSignature(sig)
      ));
    } catch (e) {
      console.error(e);
      return (this.signature = await provider.send("eth_signTypedData_v4", [
        await signer.getAddress(),
        this.toEIP712()
      ]));
    }
  }
  publish(peer: ZeroP2P) {
    if (!this.isNative()) super.publish(peer);
  }
  async fetchData() {
    if (getAddress(FIXTURES.ETHEREUM.USDT) === getAddress(this.asset)) {
      this.nonce = String(await new ethers.Contract(this.contractAddress, ['function noncesUsdt(address) view returns (uint256)'], getVanillaProvider(this)).noncesUsdt(this.owner));
      this.tokenName = 'USDT';
    } else if (getAddress(FIXTURES.AVALANCHE.USDC) === getAddress(this.asset)) {
      this.nonce = String(await new ethers.Contract(this.contractAddress, ['function noncesUsdc(address) view returns (uint256)'], getVanillaProvider(this)).noncesUsdc(this.owner));
      this.tokenName = 'USD Coin';
    } else if (isWBTC(this.asset) || this.getChainId() === 43114 && getAddress(FIXTURES.AVALANCHE.USDC) === getAddress(this.asset)) {
      this.nonce = String(await new ethers.Contract(this.contractAddress, ['function nonces(address) view returns (uint256)'], getVanillaProvider(this)).nonces(this.owner));
      if (isWBTC(this.asset)) this.tokenName = 'WBTC';
      else this.tokenName = 'USDC';
    }
    else {
      const token = new ethers.Contract(this.asset, [ "function nonces(address) view returns (uint256)", "function name() view returns (string)" ], getVanillaProvider(this));
      this.nonce = await token.nonces(this.owner);
      this.tokenName = await token.name();
    }
    return this;
  }
  buildTransaction() {
    return {
      chainId: this.getChainId(),
      data: new ethers.utils.Interface(['function burn(address, address, uint256, uint256, bytes, bytes, bytes)']).encodeFunctionData('burn', [this.owner, this.asset, this.amount, this.getExpiry(), this.data, this.destination, this.signature]),
      to: this.contractAddress
    };
  }
}
