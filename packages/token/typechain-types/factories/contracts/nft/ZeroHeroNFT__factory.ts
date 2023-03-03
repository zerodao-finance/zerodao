/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  ZeroHeroNFT,
  ZeroHeroNFTInterface,
} from "../../../contracts/nft/ZeroHeroNFT";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "ApprovalCallerNotOwnerNorApproved",
    type: "error",
  },
  {
    inputs: [],
    name: "ApprovalQueryForNonexistentToken",
    type: "error",
  },
  {
    inputs: [],
    name: "BalanceQueryForZeroAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "ExceedMaxPerWallet",
    type: "error",
  },
  {
    inputs: [],
    name: "ExceedSupply",
    type: "error",
  },
  {
    inputs: [],
    name: "InsufficientPayment",
    type: "error",
  },
  {
    inputs: [],
    name: "MintERC2309QuantityExceedsLimit",
    type: "error",
  },
  {
    inputs: [],
    name: "MintToZeroAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "MintZeroQuantity",
    type: "error",
  },
  {
    inputs: [],
    name: "NotInWhitelist",
    type: "error",
  },
  {
    inputs: [],
    name: "OwnerQueryForNonexistentToken",
    type: "error",
  },
  {
    inputs: [],
    name: "OwnershipNotInitializedForExtraData",
    type: "error",
  },
  {
    inputs: [],
    name: "PrivateMintNotStarted",
    type: "error",
  },
  {
    inputs: [],
    name: "PublicMintNotStarted",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferCallerNotOwnerNorApproved",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferFromIncorrectOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferToNonERC721ReceiverImplementer",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferToZeroAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "URIQueryForNonexistentToken",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "fromTokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "toTokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "ConsecutiveTransfer",
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
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
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
    name: "baseExtension",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "quantity",
        type: "uint8",
      },
    ],
    name: "devMint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
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
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isPresaleActive",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "quantity",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
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
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
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
    inputs: [],
    name: "presaleMerkleRoot",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "bytes32[]",
        name: "proof",
        type: "bytes32[]",
      },
      {
        internalType: "uint256",
        name: "quantity",
        type: "uint256",
      },
    ],
    name: "privateMint",
    outputs: [],
    stateMutability: "payable",
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
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_newBaseExtension",
        type: "string",
      },
    ],
    name: "setBaseExtension",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "value",
        type: "string",
      },
    ],
    name: "setBaseTokenURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "setMintPrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "value",
        type: "uint8",
      },
    ],
    name: "setPresaleMaxItemsPerWallet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "value",
        type: "bytes32",
      },
    ],
    name: "setPresaleMerkleRoot",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "setPresalePrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "startPrivateMint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "startPublicMint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
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
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "payable",
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
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x600a805462ff0000191662050000179055670429d069189e0000600b819055600c5560c06040526005608090815264173539b7b760d91b60a052600e90620000489082620001cd565b503480156200005657600080fd5b506040518060400160405280600b81526020016a16995c9bd2195c9bd3919560aa1b815250604051806040016040528060058152602001645a4845524f60d81b8152508160029081620000aa9190620001cd565b506003620000b98282620001cd565b50506000805550620000cb33620000d6565b600160095562000299565b600880546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b634e487b7160e01b600052604160045260246000fd5b600181811c908216806200015357607f821691505b6020821081036200017457634e487b7160e01b600052602260045260246000fd5b50919050565b601f821115620001c857600081815260208120601f850160051c81016020861015620001a35750805b601f850160051c820191505b81811015620001c457828155600101620001af565b5050505b505050565b81516001600160401b03811115620001e957620001e962000128565b6200020181620001fa84546200013e565b846200017a565b602080601f831160018114620002395760008415620002205750858301515b600019600386901b1c1916600185901b178555620001c4565b600085815260208120601f198616915b828110156200026a5788860151825594840194600190910190840162000249565b5085821015620002895787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b61241180620002a96000396000f3fe6080604052600436106101e35760003560e01c806370a0823111610102578063bd5204c111610095578063e6a7e93311610064578063e6a7e9331461051a578063e985e9c51461052f578063f2fde38b14610585578063f4a0a528146105a557600080fd5b8063bd5204c1146104b2578063c6682862146104c5578063c87b56dd146104da578063da3ef23f146104fa57600080fd5b806395d89b41116100d157806395d89b4114610457578063a0712d681461046c578063a22cb4651461047f578063b88d4fde1461049f57600080fd5b806370a08231146103e2578063715018a61461040257806376c64c62146104175780638da5cb5b1461042c57600080fd5b806328d7b2761161017a5780633ccfd60b116101495780633ccfd60b1461038557806342842e0e1461039a57806360d938dc146103ad5780636352211e146103c257600080fd5b806328d7b2761461030557806330176e13146103255780633497d165146103455780633549345e1461036557600080fd5b806318160ddd116101b657806318160ddd146102995780631a0ef8a9146102bc57806322212e2b146102dc57806323b872dd146102f257600080fd5b806301ffc9a7146101e857806306fdde031461021d578063081812fc1461023f578063095ea7b314610284575b600080fd5b3480156101f457600080fd5b50610208610203366004611b9a565b6105c5565b60405190151581526020015b60405180910390f35b34801561022957600080fd5b506102326106aa565b6040516102149190611c2d565b34801561024b57600080fd5b5061025f61025a366004611c40565b61073c565b60405173ffffffffffffffffffffffffffffffffffffffff9091168152602001610214565b610297610292366004611c82565b6107a6565b005b3480156102a557600080fd5b50600154600054035b604051908152602001610214565b3480156102c857600080fd5b506102976102d7366004611cac565b610891565b3480156102e857600080fd5b506102ae600f5481565b610297610300366004611ccf565b6108d3565b34801561031157600080fd5b50610297610320366004611c40565b610b63565b34801561033157600080fd5b50610297610340366004611dff565b610b70565b34801561035157600080fd5b50610297610360366004611cac565b610b88565b34801561037157600080fd5b50610297610380366004611c40565b610bf5565b34801561039157600080fd5b50610297610c02565b6102976103a8366004611ccf565b610c46565b3480156103b957600080fd5b50610208610c66565b3480156103ce57600080fd5b5061025f6103dd366004611c40565b610c93565b3480156103ee57600080fd5b506102ae6103fd366004611e48565b610c9e565b34801561040e57600080fd5b50610297610d20565b34801561042357600080fd5b50610297610d32565b34801561043857600080fd5b5060085473ffffffffffffffffffffffffffffffffffffffff1661025f565b34801561046357600080fd5b50610232610d68565b61029761047a366004611c40565b610d77565b34801561048b57600080fd5b5061029761049a366004611e63565b610e6d565b6102976104ad366004611e9f565b610f04565b6102976104c0366004611f1b565b610f74565b3480156104d157600080fd5b5061023261114d565b3480156104e657600080fd5b506102326104f5366004611c40565b6111db565b34801561050657600080fd5b50610297610515366004611dff565b6112ce565b34801561052657600080fd5b506102976112e2565b34801561053b57600080fd5b5061020861054a366004611fed565b73ffffffffffffffffffffffffffffffffffffffff918216600090815260076020908152604080832093909416825291909152205460ff1690565b34801561059157600080fd5b506102976105a0366004611e48565b611317565b3480156105b157600080fd5b506102976105c0366004611c40565b6113cb565b60007f01ffc9a7000000000000000000000000000000000000000000000000000000007fffffffff000000000000000000000000000000000000000000000000000000008316148061065857507f80ac58cd000000000000000000000000000000000000000000000000000000007fffffffff000000000000000000000000000000000000000000000000000000008316145b806106a457507f5b5e139f000000000000000000000000000000000000000000000000000000007fffffffff000000000000000000000000000000000000000000000000000000008316145b92915050565b6060600280546106b990612020565b80601f01602080910402602001604051908101604052809291908181526020018280546106e590612020565b80156107325780601f1061070757610100808354040283529160200191610732565b820191906000526020600020905b81548152906001019060200180831161071557829003601f168201915b5050505050905090565b6000610747826113d8565b61077d576040517fcf4700e400000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5060009081526006602052604090205473ffffffffffffffffffffffffffffffffffffffff1690565b60006107b182610c93565b90503373ffffffffffffffffffffffffffffffffffffffff821614610810576107da813361054a565b610810576040517fcfb3b94200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60008281526006602052604080822080547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff87811691821790925591518593918516917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591a4505050565b610899611418565b600a805460ff90921662010000027fffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ffff909216919091179055565b60006108de82611499565b90508373ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614610945576040517fa114810000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600082815260066020526040902080543380821473ffffffffffffffffffffffffffffffffffffffff8816909114176109b857610982863361054a565b6109b8576040517f59c896be00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff8516610a05576040517fea553b3400000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b8015610a1057600082555b73ffffffffffffffffffffffffffffffffffffffff86811660009081526005602052604080822080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff019055918716808252919020805460010190554260a01b177c0200000000000000000000000000000000000000000000000000000000176000858152600460205260408120919091557c020000000000000000000000000000000000000000000000000000000084169003610aff57600184016000818152600460205260408120549003610afd576000548114610afd5760008181526004602052604090208490555b505b838573ffffffffffffffffffffffffffffffffffffffff168773ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a45b505050505050565b610b6b611418565b600f55565b610b78611418565b600d610b8482826120b9565b5050565b610b90611418565b600560ff8216610ba36001546000540390565b610bad9190612202565b1115610be5576040517f5c9a0abb00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b610bf2338260ff16611550565b50565b610bfd611418565b600b55565b610c0a611418565b610c1261168e565b610c3a610c3460085473ffffffffffffffffffffffffffffffffffffffff1690565b47611701565b610c446001600955565b565b610c6183838360405180602001604052806000815250610f04565b505050565b600a5460009060ff1680610c825750600a54610100900460ff16155b15610c8d5750600190565b50600090565b60006106a482611499565b600073ffffffffffffffffffffffffffffffffffffffff8216610ced576040517f8f4eb60400000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5073ffffffffffffffffffffffffffffffffffffffff1660009081526005602052604090205467ffffffffffffffff1690565b610d28611418565b610c44600061185b565b610d3a611418565b600a80547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ff16610100179055565b6060600380546106b990612020565b610d7f61168e565b600a54610100900460ff16610dc0576040517fb35ba98d00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b80600c54610dce919061221a565b341015610e07576040517fcd1c886700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600081610e176001546000540390565b610e219190612202565b1115610e59576040517f5c9a0abb00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b610e633382611550565b610bf26001600955565b33600081815260076020908152604080832073ffffffffffffffffffffffffffffffffffffffff87168085529083529281902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b610f0f8484846108d3565b73ffffffffffffffffffffffffffffffffffffffff83163b15610f6e57610f38848484846118d2565b610f6e576040517fd1a57ed600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b50505050565b610f7c61168e565b600a5460ff161580610f955750600a54610100900460ff165b15610fcc576040517fd23cd50900000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b80600b54610fda919061221a565b341015611013576040517fcd1c886700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b610bb8816110246001546000540390565b61102e9190612202565b1115611066576040517f5c9a0abb00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600a5460ff6201000090910416816110ae3373ffffffffffffffffffffffffffffffffffffffff166000908152600560205260409081902054901c67ffffffffffffffff1690565b6110b89190612202565b11156110f0576040517fd900aa8a00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6110fc82868686611a4c565b611132576040517f5b0aa2ba00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b61113c8482611550565b6111466001600955565b5050505050565b600e805461115a90612020565b80601f016020809104026020016040519081016040528092919081815260200182805461118690612020565b80156111d35780601f106111a8576101008083540402835291602001916111d3565b820191906000526020600020905b8154815290600101906020018083116111b657829003601f168201915b505050505081565b60606111e6826113d8565b611277576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602f60248201527f4552433732314d657461646174613a2055524920717565727920666f72206e6f60448201527f6e6578697374656e7420746f6b656e000000000000000000000000000000000060648201526084015b60405180910390fd5b6000611281611ace565b905060008151116112a157604051806020016040528060008152506112c7565b8083600e6040516020016112b793929190612257565b6040516020818303038152906040525b9392505050565b6112d6611418565b600e610b8482826120b9565b6112ea611418565b600a80547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00166001179055565b61131f611418565b73ffffffffffffffffffffffffffffffffffffffff81166113c2576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f6464726573730000000000000000000000000000000000000000000000000000606482015260840161126e565b610bf28161185b565b6113d3611418565b600c55565b60008054821080156106a45750506000908152600460205260409020547c0100000000000000000000000000000000000000000000000000000000161590565b60085473ffffffffffffffffffffffffffffffffffffffff163314610c44576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015260640161126e565b60008160005481101561151e57600081815260046020526040812054907c01000000000000000000000000000000000000000000000000000000008216900361151c575b806000036112c757507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff016000818152600460205260409020546114dd565b505b6040517fdf2d9b4200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600080549082900361158e576040517fb562e8dd00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff831660008181526005602090815260408083208054680100000000000000018802019055848352600490915281206001851460e11b4260a01b178317905582840190839083907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8180a4600183015b81811461164a57808360007fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef600080a4600101611612565b5081600003611685576040517f2e07630000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60005550505050565b6002600954036116fa576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c00604482015260640161126e565b6002600955565b8047101561176b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f416464726573733a20696e73756666696369656e742062616c616e6365000000604482015260640161126e565b60008273ffffffffffffffffffffffffffffffffffffffff168260405160006040518083038185875af1925050503d80600081146117c5576040519150601f19603f3d011682016040523d82523d6000602084013e6117ca565b606091505b5050905080610c61576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603a60248201527f416464726573733a20756e61626c6520746f2073656e642076616c75652c207260448201527f6563697069656e74206d61792068617665207265766572746564000000000000606482015260840161126e565b6008805473ffffffffffffffffffffffffffffffffffffffff8381167fffffffffffffffffffffffff0000000000000000000000000000000000000000831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6040517f150b7a0200000000000000000000000000000000000000000000000000000000815260009073ffffffffffffffffffffffffffffffffffffffff85169063150b7a029061192d90339089908890889060040161230e565b6020604051808303816000875af1925050508015611986575060408051601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016820190925261198391810190612357565b60015b6119fd573d8080156119b4576040519150601f19603f3d011682016040523d82523d6000602084013e6119b9565b606091505b5080516000036119f5576040517fd1a57ed600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b805181602001fd5b7fffffffff00000000000000000000000000000000000000000000000000000000167f150b7a02000000000000000000000000000000000000000000000000000000001490505b949350505050565b6000611ac5600f54858585604051602001611a9f9392919092835260609190911b7fffffffffffffffffffffffffffffffffffffffff000000000000000000000000166020830152603482015260540190565b6040516020818303038152906040528051906020012087611add9092919063ffffffff16565b95945050505050565b6060600d80546106b990612020565b600082611aea8584611af3565b14949350505050565b600081815b8451811015611b3857611b2482868381518110611b1757611b17612374565b6020026020010151611b40565b915080611b30816123a3565b915050611af8565b509392505050565b6000818310611b5c5760008281526020849052604090206112c7565b5060009182526020526040902090565b7fffffffff0000000000000000000000000000000000000000000000000000000081168114610bf257600080fd5b600060208284031215611bac57600080fd5b81356112c781611b6c565b60005b83811015611bd2578181015183820152602001611bba565b83811115610f6e5750506000910152565b60008151808452611bfb816020860160208601611bb7565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b6020815260006112c76020830184611be3565b600060208284031215611c5257600080fd5b5035919050565b803573ffffffffffffffffffffffffffffffffffffffff81168114611c7d57600080fd5b919050565b60008060408385031215611c9557600080fd5b611c9e83611c59565b946020939093013593505050565b600060208284031215611cbe57600080fd5b813560ff811681146112c757600080fd5b600080600060608486031215611ce457600080fd5b611ced84611c59565b9250611cfb60208501611c59565b9150604084013590509250925092565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016810167ffffffffffffffff81118282101715611d8157611d81611d0b565b604052919050565b600067ffffffffffffffff831115611da357611da3611d0b565b611dd460207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f86011601611d3a565b9050828152838383011115611de857600080fd5b828260208301376000602084830101529392505050565b600060208284031215611e1157600080fd5b813567ffffffffffffffff811115611e2857600080fd5b8201601f81018413611e3957600080fd5b611a4484823560208401611d89565b600060208284031215611e5a57600080fd5b6112c782611c59565b60008060408385031215611e7657600080fd5b611e7f83611c59565b915060208301358015158114611e9457600080fd5b809150509250929050565b60008060008060808587031215611eb557600080fd5b611ebe85611c59565b9350611ecc60208601611c59565b925060408501359150606085013567ffffffffffffffff811115611eef57600080fd5b8501601f81018713611f0057600080fd5b611f0f87823560208401611d89565b91505092959194509250565b600080600080600060a08688031215611f3357600080fd5b853594506020611f44818801611c59565b945060408701359350606087013567ffffffffffffffff80821115611f6857600080fd5b818901915089601f830112611f7c57600080fd5b813581811115611f8e57611f8e611d0b565b8060051b9150611f9f848301611d3a565b818152918301840191848101908c841115611fb957600080fd5b938501935b83851015611fd757843582529385019390850190611fbe565b999c989b50969960800135979650505050505050565b6000806040838503121561200057600080fd5b61200983611c59565b915061201760208401611c59565b90509250929050565b600181811c9082168061203457607f821691505b60208210810361206d577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b601f821115610c6157600081815260208120601f850160051c8101602086101561209a5750805b601f850160051c820191505b81811015610b5b578281556001016120a6565b815167ffffffffffffffff8111156120d3576120d3611d0b565b6120e7816120e18454612020565b84612073565b602080601f83116001811461213a57600084156121045750858301515b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600386901b1c1916600185901b178555610b5b565b6000858152602081207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08616915b8281101561218757888601518255948401946001909101908401612168565b50858210156121c357878501517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600388901b60f8161c191681555b5050505050600190811b01905550565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60008219821115612215576122156121d3565b500190565b6000817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0483118215151615612252576122526121d3565b500290565b60008451602061226a8285838a01611bb7565b81840191508582526000855461227f81612020565b6001828116801561229757600181146122ce576122fe565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0084168688015285831515840288010194506122fe565b896000528560002060005b848110156122f45781548982018901529083019087016122d9565b5050858388010194505b50929a9950505050505050505050565b600073ffffffffffffffffffffffffffffffffffffffff80871683528086166020840152508360408301526080606083015261234d6080830184611be3565b9695505050505050565b60006020828403121561236957600080fd5b81516112c781611b6c565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82036123d4576123d46121d3565b506001019056fea2646970667358221220557b9f82349cfeae476b625fa7be3ce8aff81ea75bd98d5c851c9d534114373064736f6c634300080f0033";

type ZeroHeroNFTConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ZeroHeroNFTConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ZeroHeroNFT__factory extends ContractFactory {
  constructor(...args: ZeroHeroNFTConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ZeroHeroNFT> {
    return super.deploy(overrides || {}) as Promise<ZeroHeroNFT>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): ZeroHeroNFT {
    return super.attach(address) as ZeroHeroNFT;
  }
  override connect(signer: Signer): ZeroHeroNFT__factory {
    return super.connect(signer) as ZeroHeroNFT__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ZeroHeroNFTInterface {
    return new utils.Interface(_abi) as ZeroHeroNFTInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ZeroHeroNFT {
    return new Contract(address, _abi, signerOrProvider) as ZeroHeroNFT;
  }
}
