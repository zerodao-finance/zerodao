/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  MasterChef,
  MasterChefInterface,
} from "../../../../contracts/token/MasterChef.sol/MasterChef";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "pid",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "pid",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "EmergencyWithdraw",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "pid",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Withdraw",
    type: "event",
  },
  {
    inputs: [],
    name: "BONUS_MULTIPLIER",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_allocPoint",
        type: "uint256",
      },
      {
        internalType: "contract IERC20",
        name: "_lpToken",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_withUpdate",
        type: "bool",
      },
    ],
    name: "add",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "bonusEndBlock",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_pid",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_devaddr",
        type: "address",
      },
    ],
    name: "dev",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "devaddr",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_pid",
        type: "uint256",
      },
    ],
    name: "emergencyWithdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_from",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_to",
        type: "uint256",
      },
    ],
    name: "getMultiplier",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract sZERO",
        name: "_zero",
        type: "address",
      },
      {
        internalType: "address",
        name: "_devaddr",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_zeroPerBlock",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_startBlock",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_bonusEndBlock",
        type: "uint256",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "massUpdatePools",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_pid",
        type: "uint256",
      },
    ],
    name: "migrate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "migrator",
    outputs: [
      {
        internalType: "contract IMigratorChef",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_pid",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "pendingZero",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "poolInfo",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "lpToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "allocPoint",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lastRewardBlock",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "accZeroPerShare",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "poolLength",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_pid",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_allocPoint",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_withUpdate",
        type: "bool",
      },
    ],
    name: "set",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IMigratorChef",
        name: "_migrator",
        type: "address",
      },
    ],
    name: "setMigrator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "startBlock",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalAllocPoint",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_pid",
        type: "uint256",
      },
    ],
    name: "updatePool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "userInfo",
    outputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "rewardDebt",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_pid",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "zero",
    outputs: [
      {
        internalType: "contract sZERO",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "zeroPerBlock",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x6080806040523461001b576000606c5561232590816100218239f35b600080fdfe608060408181526004918236101561001657600080fd5b600090813560e01c908163081e3eda14611791575080631526fe271461168e57806317caf6f1146116515780631aed6553146116145780631eaaa0451461145057806323cf3118146113cc57806327db60891461138f578063441a3e7014611250578063454b060814610de857806348cd4cb114610dab57806351eb05a614610d705780635312ea8e14610cc1578063630b5ba114610c8657806364482f7914610bc6578063715018a614610b255780637cd07e4714610ad25780638aa2855014610a985780638d88a90e146109b05780638da5cb5b1461095d5780638dbb1e3a1461094157806393f1a40b146108ca578063bc1b392d14610877578063d13f90b414610654578063d49e77cd14610601578063e2bbb1581461045e578063f2fde38b146103215763fe441df51461014d57600080fd5b3461031e57817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261031e5782359061018661189f565b61018f836117cb565b50928252602094606b865284832073ffffffffffffffffffffffffffffffffffffffff80931684528652848320926024876003870154948754168851928380927f70a0823100000000000000000000000000000000000000000000000000000000825230888301525afa9081156103145782916102e3575b506002860154804311806102da575b610245575b888861023e88600164e8d4a510006102348b8454611db6565b04910154906119c5565b9051908152f35b61028061027761028a94959798600161026e610265610285964390611cf6565b60685490611db6565b91015490611db6565b606c5490611de7565b611d4a565b611de7565b92831983116102ae57505064e8d4a5100061023461023e949360019301923861021b565b9060116024927f4e487b7100000000000000000000000000000000000000000000000000000000835252fd5b50811515610216565b90508781813d831161030d575b6102fa8183611984565b81010312610309575138610207565b5080fd5b503d6102f0565b87513d84823e3d90fd5b80fd5b50913461045a5760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261045a5761035a61187c565b6103626118c2565b73ffffffffffffffffffffffffffffffffffffffff8091169182156103d7575060335492827fffffffffffffffffffffffff00000000000000000000000000000000000000008516176033555192167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08484a3f35b60849060208551917f08c379a0000000000000000000000000000000000000000000000000000000008352820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152fd5b8280fd5b50913461045a5761046e36611848565b9091610479836117cb565b50838652606b6020528486203387526020528486209161049885611e98565b8254806105ce575b5073ffffffffffffffffffffffffffffffffffffffff8254168651907f23b872dd0000000000000000000000000000000000000000000000000000000060208301523360248301523060448301528560648301526064825260a0820182811067ffffffffffffffff8211176105a257885261051b9190611a17565b82549084198211610576575061054460019260038664e8d4a51000940191828755015490611db6565b0491015582519081527f90890809c654f11d6e72a28fa60149770a0d11ec6c92319d6ceb2bb0a4ea1a1560203392a351f35b8760116024927f4e487b7100000000000000000000000000000000000000000000000000000000835252fd5b60248a6041867f4e487b7100000000000000000000000000000000000000000000000000000000835252fd5b6105f564e8d4a510006105e96105fb93600387015490611db6565b046001860154906119c5565b3361213d565b386104a0565b50903461030957817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103095760209073ffffffffffffffffffffffffffffffffffffffff606654169051908152f35b50913461045a5760a07ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261045a57803573ffffffffffffffffffffffffffffffffffffffff808216809203610873576106ae61189f565b855460ff8160081c161594858096610866575b801561084f575b156107cc57508460017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00831617885561079e575b507fffffffffffffffffffffffff00000000000000000000000000000000000000009283606554161760655516906066541617606655604435606855608435606755606435606d5561074b5751f35b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ff82541682557f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024986020825160018152a151f35b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000016610101178655386106fc565b60849060208851917f08c379a0000000000000000000000000000000000000000000000000000000008352820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201527f647920696e697469616c697a65640000000000000000000000000000000000006064820152fd5b50303b1580156106c85750600160ff8316146106c8565b50600160ff8316106106c1565b8480fd5b50903461030957817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103095760209073ffffffffffffffffffffffffffffffffffffffff606554169051908152f35b50913461045a57817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261045a5791819261090561189f565b90358252606b60205273ffffffffffffffffffffffffffffffffffffffff83832091168252602052206001815491015482519182526020820152f35b5090346103095760209061023e61095736611848565b90611cf6565b50903461030957817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103095760209073ffffffffffffffffffffffffffffffffffffffff603354169051908152f35b50913461045a5760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261045a576109e961187c565b906066549173ffffffffffffffffffffffffffffffffffffffff918284163303610a3b5750907fffffffffffffffffffffffff0000000000000000000000000000000000000000911691161760665551f35b60649060208651917f08c379a0000000000000000000000000000000000000000000000000000000008352820152600960248201527f6465763a207775743f00000000000000000000000000000000000000000000006044820152fd5b50903461030957817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103095760209051600a8152f35b50903461030957817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103095760209073ffffffffffffffffffffffffffffffffffffffff606954169051908152f35b50903461030957817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261030957610b5d6118c2565b8173ffffffffffffffffffffffffffffffffffffffff603354927fffffffffffffffffffffffff000000000000000000000000000000000000000084166033555192167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08284a3f35b50913461045a5760607ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261045a57803560243591610c05611834565b610c0d6118c2565b610c79575b610c2c606c546001610c23856117cb565b500154906119c5565b9083198211610c4d575060019183610c479201606c556117cb565b50015551f35b8560116024927f4e487b7100000000000000000000000000000000000000000000000000000000835252fd5b610c81611e20565b610c12565b50903461030957817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261030957610cbe611e20565b51f35b508092346103095760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103095760019035610d00816117cb565b5090808452606b602052848420338552602052610d3b73ffffffffffffffffffffffffffffffffffffffff86862093541683549033906120d4565b815485519081527fbb757047c2b5f3974fe26b7c10f732e7bce710b0952a71082702781e62ae059560203392a3828155015551f35b50913461045a5760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261045a57610cbe9035611e98565b50903461030957817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261030957602090606d549051908152f35b50913461045a57602090817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261124c5773ffffffffffffffffffffffffffffffffffffffff90816069541680156111f057610e4682356117cb565b5093838554168651947f70a082310000000000000000000000000000000000000000000000000000000091828752308688015260249484888781855afa9788156111e6578b986111b3575b508715801561112b575b156110aa578a91610f3589610f2f8894610f038f519384927f095ea7b300000000000000000000000000000000000000000000000000000000898501528d84016020909392919373ffffffffffffffffffffffffffffffffffffffff60408201951681520152565b037fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08101835282611984565b82611a17565b868460695416918c5194859384927fce5494bb0000000000000000000000000000000000000000000000000000000084528c8401525af19081156110a0578a91611066575b5016948751918252308583015282828581895afa91821561105c578992611029575b5003610fcf575050507fffffffffffffffffffffffff000000000000000000000000000000000000000082541617905551f35b85517f08c379a000000000000000000000000000000000000000000000000000000000815292830152600c908201527f6d6967726174653a2062616400000000000000000000000000000000000000006044820152606490fd5b9091508281813d8311611055575b6110418183611984565b8101031261105157519038610f9c565b8880fd5b503d611037565b88513d8b823e3d90fd5b90508381813d8311611099575b61107d8183611984565b81010312611095575181811681036110955738610f7a565b8980fd5b503d611073565b89513d8c823e3d90fd5b608487603688888e51937f08c379a00000000000000000000000000000000000000000000000000000000085528401528201527f5361666545524332303a20617070726f76652066726f6d206e6f6e2d7a65726f60448201527f20746f206e6f6e2d7a65726f20616c6c6f77616e6365000000000000000000006064820152fd5b5089517fdd62ed3e000000000000000000000000000000000000000000000000000000008152308882015281878201528581604481865afa9081156111a9578c91611178575b5015610e9b565b90508581813d83116111a2575b61118f8183611984565b8101031261119e575138611171565b8b80fd5b503d611185565b8b513d8e823e3d90fd5b9097508481813d83116111df575b6111cb8183611984565b810103126111db57519638610e91565b8a80fd5b503d6111c1565b8a513d8d823e3d90fd5b606482858751917f08c379a0000000000000000000000000000000000000000000000000000000008352820152601460248201527f6d6967726174653a206e6f206d69677261746f720000000000000000000000006044820152fd5b8380fd5b50913461045a5761126036611848565b909161126b836117cb565b5090838652606b6020528486203387526020528486209083825410611332575061130491839161129a86611e98565b6112b96112e3825492600385019364e8d4a51000938491865490611db6565b04936112ce6105f560018401968754906119c5565b6112d98783546119c5565b8092555490611db6565b04905573ffffffffffffffffffffffffffffffffffffffff339154166120d4565b82519081527ff279e6a1f5e320cca91135676d9cb6e44ca8a08c0b88342bcdb1144f6511b56860203392a351f35b60649060208751917f08c379a0000000000000000000000000000000000000000000000000000000008352820152601260248201527f77697468647261773a206e6f7420676f6f6400000000000000000000000000006044820152fd5b50903461030957817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610309576020906068549051908152f35b50913461045a5760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261045a573573ffffffffffffffffffffffffffffffffffffffff811680910361045a576114246118c2565b7fffffffffffffffffffffffff0000000000000000000000000000000000000000606954161760695551f35b5090346103095760607ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103095782356024359073ffffffffffffffffffffffffffffffffffffffff90818316809303610873576114af611834565b6114b76118c2565b611607575b606d54804311600014611601575043905b606c54811981116115d5578101606c558451936080850185811067ffffffffffffffff8211176115a95786528452602084019081528484019182526060840192868452606a54680100000000000000008110156115a9578060016115349201606a556117cb565b95909561157e576003959697985051167fffffffffffffffffffffffff00000000000000000000000000000000000000008654161785555160018501555160028401555191015551f35b602488808b7f4e487b7100000000000000000000000000000000000000000000000000000000825252fd5b60248860418b7f4e487b7100000000000000000000000000000000000000000000000000000000835252fd5b60248760118a7f4e487b7100000000000000000000000000000000000000000000000000000000835252fd5b906114cd565b61160f611e20565b6114bc565b50903461030957817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610309576020906067549051908152f35b50903461030957817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261030957602090606c549051908152f35b50913461045a5760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261045a5735606a5481101561045a57606a6080935260021b9073ffffffffffffffffffffffffffffffffffffffff827f116fea137db6e131133e7f2bab296045d8f41cc5607279db17b218cab0929a51015416917f116fea137db6e131133e7f2bab296045d8f41cc5607279db17b218cab0929a52810154917f116fea137db6e131133e7f2bab296045d8f41cc5607279db17b218cab0929a547f116fea137db6e131133e7f2bab296045d8f41cc5607279db17b218cab0929a5383015492015492815194855260208501528301526060820152f35b90503461030957817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261030957602090606a548152f35b606a5481101561180557606a60005260021b7f116fea137db6e131133e7f2bab296045d8f41cc5607279db17b218cab0929a510190600090565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60443590811515820361184357565b600080fd5b7ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc6040910112611843576004359060243590565b6004359073ffffffffffffffffffffffffffffffffffffffff8216820361184357565b6024359073ffffffffffffffffffffffffffffffffffffffff8216820361184357565b73ffffffffffffffffffffffffffffffffffffffff6033541633036118e357565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602060248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152fd5b67ffffffffffffffff811161195557604052565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b90601f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0910116810190811067ffffffffffffffff82111761195557604052565b8181106119d0570390565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b90816020910312611843575180151581036118435790565b73ffffffffffffffffffffffffffffffffffffffff9092919216604051604081019367ffffffffffffffff9482811086821117611955576040526020928383527f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564848401526000808386829551910182855af1903d15611bb8573d968711611b8b57611ae294959660405190611ad4887fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f8401160183611984565b81528093873d92013e611bc5565b80519081611aef57505050565b8280611aff9383010191016119ff565b15611b075750565b608490604051907f08c379a00000000000000000000000000000000000000000000000000000000082526004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e60448201527f6f742073756363656564000000000000000000000000000000000000000000006064820152fd5b6024837f4e487b710000000000000000000000000000000000000000000000000000000081526041600452fd5b9150611ae2939495506060915b91929015611c405750815115611bd9575090565b3b15611be25790565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152fd5b825190915015611c535750805190602001fd5b604051907f08c379a00000000000000000000000000000000000000000000000000000000082528160208060048301528251928360248401526000915b848310611cdd575050601f836044947fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe09311611cd0575b01168101030190fd5b6000858286010152611cc7565b8183018101518684016044015285935091820191611c90565b606754808311611d165750611d0e90611d13926119c5565b611d82565b90565b808210611d275750611d13916119c5565b611d37611d0e611d3d93836119c5565b926119c5565b90811981116119d0570190565b64e8d4a5100090807fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff048211811515166119d0570290565b807fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff04600a11811515166119d057600a0290565b807fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff048211811515166119d0570290565b8115611df1570490565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b606a546000805b828110611e3357505050565b611e3c81611e98565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8114611e6b57600101611e27565b6024827f4e487b710000000000000000000000000000000000000000000000000000000081526011600452fd5b611ea1906117cb565b50600281019081546000904311156120cf5760249173ffffffffffffffffffffffffffffffffffffffff908181541660206040918251968780927f70a082310000000000000000000000000000000000000000000000000000000082523060048301525afa9485156120c5578495612092575b50841561208857611f3a610277611f2f610265438a54611cf6565b600185015490611db6565b9280606554168160665416813b156120845783517f40c10f190000000000000000000000000000000000000000000000000000000080825273ffffffffffffffffffffffffffffffffffffffff929092166004820152600a870460248201529093929187908290604490829084905af1801561207a57612067575b506065541691823b15612063578151908152306004820152602481018590529185908390604490829084905af190811561205a5750908491612046575b50506003612007910193610285855493611d4a565b91821982116120195750019055439055565b807f4e487b7100000000000000000000000000000000000000000000000000000000602492526011600452fd5b61204f90611941565b61045a578238611ff2565b513d86823e3d90fd5b8580fd5b61207390969196611941565b9438611fb5565b83513d89823e3d90fd5b8680fd5b5050505050439055565b9094506020813d82116120bd575b816120ad60209383611984565b8101031261124c57519338611f14565b3d91506120a0565b81513d86823e3d90fd5b505050565b6040517fa9059cbb00000000000000000000000000000000000000000000000000000000602082015273ffffffffffffffffffffffffffffffffffffffff92909216602483015260448083019390935291815261213b91612136606483611984565b611a17565b565b73ffffffffffffffffffffffffffffffffffffffff908160655416916040918251917f70a082310000000000000000000000000000000000000000000000000000000083523060048401526020958684602481895afa9384156122e4579087949392916000946122ae575b5083811115612255575060655485517fa9059cbb00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff9093166004840152602483019390935290945084911681600081604481015b03925af190811561224b5750612222575050565b8161224192903d10612244575b6122398183611984565b8101906119ff565b50565b503d61222f565b513d6000823e3d90fd5b85517fa9059cbb00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff909316600484015260248301525093849150816000816044810161220e565b919293909482813d83116122dd575b6122c78183611984565b8101031261031e575090869392915192386121a8565b503d6122bd565b85513d6000823e3d90fdfea2646970667358221220404ba144227007e27fc9b99dcbd7fca3fbb4d86a7618bac0822a0201f99bd4fe64736f6c634300080f0033";

type MasterChefConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MasterChefConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MasterChef__factory extends ContractFactory {
  constructor(...args: MasterChefConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<MasterChef> {
    return super.deploy(overrides || {}) as Promise<MasterChef>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): MasterChef {
    return super.attach(address) as MasterChef;
  }
  override connect(signer: Signer): MasterChef__factory {
    return super.connect(signer) as MasterChef__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MasterChefInterface {
    return new utils.Interface(_abi) as MasterChefInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MasterChef {
    return new Contract(address, _abi, signerOrProvider) as MasterChef;
  }
}