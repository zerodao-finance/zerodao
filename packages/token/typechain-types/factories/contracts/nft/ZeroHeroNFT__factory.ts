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
  "0x6080604052600a805462ff0000191662030000179055670429d069189e0000600b819055600c553480156200003357600080fd5b506040518060400160405280600b81526020016a16995c9bd2195c9bd3919560aa1b815250604051806040016040528060058152602001645a4845524f60d81b8152508160029081620000879190620001aa565b506003620000968282620001aa565b50506000805550620000a833620000b3565b600160095562000276565b600880546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b634e487b7160e01b600052604160045260246000fd5b600181811c908216806200013057607f821691505b6020821081036200015157634e487b7160e01b600052602260045260246000fd5b50919050565b601f821115620001a557600081815260208120601f850160051c81016020861015620001805750805b601f850160051c820191505b81811015620001a1578281556001016200018c565b5050505b505050565b81516001600160401b03811115620001c657620001c662000105565b620001de81620001d784546200011b565b8462000157565b602080601f831160018114620002165760008415620001fd5750858301515b600019600386901b1c1916600185901b178555620001a1565b600085815260208120601f198616915b82811015620002475788860151825594840194600190910190840162000226565b5085821015620002665787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b6122ae80620002866000396000f3fe6080604052600436106101cd5760003560e01c80636352211e116100f7578063a22cb46511610095578063e6a7e93311610064578063e6a7e933146104cf578063e985e9c5146104e4578063f2fde38b1461053a578063f4a0a5281461055a57600080fd5b8063a22cb46514610469578063b88d4fde14610489578063bd5204c11461049c578063c87b56dd146104af57600080fd5b806376c64c62116100d157806376c64c62146104015780638da5cb5b1461041657806395d89b4114610441578063a0712d681461045657600080fd5b80636352211e146103ac57806370a08231146103cc578063715018a6146103ec57600080fd5b806323b872dd1161016f5780633549345e1161013e5780633549345e1461034f5780633ccfd60b1461036f57806342842e0e1461038457806360d938dc1461039757600080fd5b806323b872dd146102dc57806328d7b276146102ef57806330176e131461030f5780633497d1651461032f57600080fd5b8063095ea7b3116101ab578063095ea7b31461026e57806318160ddd146102835780631a0ef8a9146102a657806322212e2b146102c657600080fd5b806301ffc9a7146101d257806306fdde0314610207578063081812fc14610229575b600080fd5b3480156101de57600080fd5b506101f26101ed366004611abf565b61057a565b60405190151581526020015b60405180910390f35b34801561021357600080fd5b5061021c61065f565b6040516101fe9190611b52565b34801561023557600080fd5b50610249610244366004611b65565b6106f1565b60405173ffffffffffffffffffffffffffffffffffffffff90911681526020016101fe565b61028161027c366004611ba7565b61075b565b005b34801561028f57600080fd5b50600154600054035b6040519081526020016101fe565b3480156102b257600080fd5b506102816102c1366004611bd1565b610846565b3480156102d257600080fd5b50610298600e5481565b6102816102ea366004611bf4565b610888565b3480156102fb57600080fd5b5061028161030a366004611b65565b610b18565b34801561031b57600080fd5b5061028161032a366004611d24565b610b25565b34801561033b57600080fd5b5061028161034a366004611bd1565b610b3d565b34801561035b57600080fd5b5061028161036a366004611b65565b610baa565b34801561037b57600080fd5b50610281610bb7565b610281610392366004611bf4565b610bfb565b3480156103a357600080fd5b506101f2610c1b565b3480156103b857600080fd5b506102496103c7366004611b65565b610c48565b3480156103d857600080fd5b506102986103e7366004611d6d565b610c53565b3480156103f857600080fd5b50610281610cd5565b34801561040d57600080fd5b50610281610ce7565b34801561042257600080fd5b5060085473ffffffffffffffffffffffffffffffffffffffff16610249565b34801561044d57600080fd5b5061021c610d1d565b610281610464366004611b65565b610d2c565b34801561047557600080fd5b50610281610484366004611d88565b610e23565b610281610497366004611dc4565b610eba565b6102816104aa366004611e40565b610f2a565b3480156104bb57600080fd5b5061021c6104ca366004611b65565b611103565b3480156104db57600080fd5b506102816111a0565b3480156104f057600080fd5b506101f26104ff366004611f12565b73ffffffffffffffffffffffffffffffffffffffff918216600090815260076020908152604080832093909416825291909152205460ff1690565b34801561054657600080fd5b50610281610555366004611d6d565b6111d5565b34801561056657600080fd5b50610281610575366004611b65565b61128e565b60007f01ffc9a7000000000000000000000000000000000000000000000000000000007fffffffff000000000000000000000000000000000000000000000000000000008316148061060d57507f80ac58cd000000000000000000000000000000000000000000000000000000007fffffffff000000000000000000000000000000000000000000000000000000008316145b8061065957507f5b5e139f000000000000000000000000000000000000000000000000000000007fffffffff000000000000000000000000000000000000000000000000000000008316145b92915050565b60606002805461066e90611f45565b80601f016020809104026020016040519081016040528092919081815260200182805461069a90611f45565b80156106e75780601f106106bc576101008083540402835291602001916106e7565b820191906000526020600020905b8154815290600101906020018083116106ca57829003601f168201915b5050505050905090565b60006106fc8261129b565b610732576040517fcf4700e400000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5060009081526006602052604090205473ffffffffffffffffffffffffffffffffffffffff1690565b600061076682610c48565b90503373ffffffffffffffffffffffffffffffffffffffff8216146107c55761078f81336104ff565b6107c5576040517fcfb3b94200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60008281526006602052604080822080547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff87811691821790925591518593918516917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591a4505050565b61084e6112db565b600a805460ff90921662010000027fffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ffff909216919091179055565b60006108938261135c565b90508373ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16146108fa576040517fa114810000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600082815260066020526040902080543380821473ffffffffffffffffffffffffffffffffffffffff88169091141761096d5761093786336104ff565b61096d576040517f59c896be00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff85166109ba576040517fea553b3400000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b80156109c557600082555b73ffffffffffffffffffffffffffffffffffffffff86811660009081526005602052604080822080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff019055918716808252919020805460010190554260a01b177c0200000000000000000000000000000000000000000000000000000000176000858152600460205260408120919091557c020000000000000000000000000000000000000000000000000000000084169003610ab457600184016000818152600460205260408120549003610ab2576000548114610ab25760008181526004602052604090208490555b505b838573ffffffffffffffffffffffffffffffffffffffff168773ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a45b505050505050565b610b206112db565b600e55565b610b2d6112db565b600d610b398282611fde565b5050565b610b456112db565b600560ff8216610b586001546000540390565b610b629190612127565b1115610b9a576040517f5c9a0abb00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b610ba7338260ff16611413565b50565b610bb26112db565b600b55565b610bbf6112db565b610bc7611551565b610bef610be960085473ffffffffffffffffffffffffffffffffffffffff1690565b476115c4565b610bf96001600955565b565b610c1683838360405180602001604052806000815250610eba565b505050565b600a5460009060ff1680610c375750600a54610100900460ff16155b15610c425750600190565b50600090565b60006106598261135c565b600073ffffffffffffffffffffffffffffffffffffffff8216610ca2576040517f8f4eb60400000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5073ffffffffffffffffffffffffffffffffffffffff1660009081526005602052604090205467ffffffffffffffff1690565b610cdd6112db565b610bf9600061171e565b610cef6112db565b600a80547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ff16610100179055565b60606003805461066e90611f45565b610d34611551565b600a54610100900460ff16610d75576040517fb35ba98d00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b80600c54610d83919061213f565b341015610dbc576040517fcd1c886700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6107d081610dcd6001546000540390565b610dd79190612127565b1115610e0f576040517f5c9a0abb00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b610e193382611413565b610ba76001600955565b33600081815260076020908152604080832073ffffffffffffffffffffffffffffffffffffffff87168085529083529281902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b610ec5848484610888565b73ffffffffffffffffffffffffffffffffffffffff83163b15610f2457610eee84848484611795565b610f24576040517fd1a57ed600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b50505050565b610f32611551565b600a5460ff161580610f4b5750600a54610100900460ff165b15610f82576040517fd23cd50900000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b80600b54610f90919061213f565b341015610fc9576040517fcd1c886700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6107d081610fda6001546000540390565b610fe49190612127565b111561101c576040517f5c9a0abb00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600a5460ff6201000090910416816110643373ffffffffffffffffffffffffffffffffffffffff166000908152600560205260409081902054901c67ffffffffffffffff1690565b61106e9190612127565b11156110a6576040517fd900aa8a00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6110b28286868661190f565b6110e8576040517f5b0aa2ba00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6110f28482611413565b6110fc6001600955565b5050505050565b606061110e8261129b565b611144576040517fa14c4b5000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600061114e611991565b9050805160000361116e5760405180602001604052806000815250611199565b80611178846119a0565b60405160200161118992919061217c565b6040516020818303038152906040525b9392505050565b6111a86112db565b600a80547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00166001179055565b6111dd6112db565b73ffffffffffffffffffffffffffffffffffffffff8116611285576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f646472657373000000000000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b610ba78161171e565b6112966112db565b600c55565b60008054821080156106595750506000908152600460205260409020547c0100000000000000000000000000000000000000000000000000000000161590565b60085473ffffffffffffffffffffffffffffffffffffffff163314610bf9576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015260640161127c565b6000816000548110156113e157600081815260046020526040812054907c0100000000000000000000000000000000000000000000000000000000821690036113df575b8060000361119957507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff016000818152600460205260409020546113a0565b505b6040517fdf2d9b4200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000805490829003611451576040517fb562e8dd00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff831660008181526005602090815260408083208054680100000000000000018802019055848352600490915281206001851460e11b4260a01b178317905582840190839083907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8180a4600183015b81811461150d57808360007fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef600080a46001016114d5565b5081600003611548576040517f2e07630000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60005550505050565b6002600954036115bd576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c00604482015260640161127c565b6002600955565b8047101561162e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f416464726573733a20696e73756666696369656e742062616c616e6365000000604482015260640161127c565b60008273ffffffffffffffffffffffffffffffffffffffff168260405160006040518083038185875af1925050503d8060008114611688576040519150601f19603f3d011682016040523d82523d6000602084013e61168d565b606091505b5050905080610c16576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603a60248201527f416464726573733a20756e61626c6520746f2073656e642076616c75652c207260448201527f6563697069656e74206d61792068617665207265766572746564000000000000606482015260840161127c565b6008805473ffffffffffffffffffffffffffffffffffffffff8381167fffffffffffffffffffffffff0000000000000000000000000000000000000000831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6040517f150b7a0200000000000000000000000000000000000000000000000000000000815260009073ffffffffffffffffffffffffffffffffffffffff85169063150b7a02906117f09033908990889088906004016121ab565b6020604051808303816000875af1925050508015611849575060408051601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0168201909252611846918101906121f4565b60015b6118c0573d808015611877576040519150601f19603f3d011682016040523d82523d6000602084013e61187c565b606091505b5080516000036118b8576040517fd1a57ed600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b805181602001fd5b7fffffffff00000000000000000000000000000000000000000000000000000000167f150b7a02000000000000000000000000000000000000000000000000000000001490505b949350505050565b6000611988600e548585856040516020016119629392919092835260609190911b7fffffffffffffffffffffffffffffffffffffffff000000000000000000000000166020830152603482015260540190565b6040516020818303038152906040528051906020012087611a029092919063ffffffff16565b95945050505050565b6060600d805461066e90611f45565b606060a06040510180604052602081039150506000815280825b600183039250600a81066030018353600a9004806119ba57508190037fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0909101908152919050565b600082611a0f8584611a18565b14949350505050565b600081815b8451811015611a5d57611a4982868381518110611a3c57611a3c612211565b6020026020010151611a65565b915080611a5581612240565b915050611a1d565b509392505050565b6000818310611a81576000828152602084905260409020611199565b5060009182526020526040902090565b7fffffffff0000000000000000000000000000000000000000000000000000000081168114610ba757600080fd5b600060208284031215611ad157600080fd5b813561119981611a91565b60005b83811015611af7578181015183820152602001611adf565b83811115610f245750506000910152565b60008151808452611b20816020860160208601611adc565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b6020815260006111996020830184611b08565b600060208284031215611b7757600080fd5b5035919050565b803573ffffffffffffffffffffffffffffffffffffffff81168114611ba257600080fd5b919050565b60008060408385031215611bba57600080fd5b611bc383611b7e565b946020939093013593505050565b600060208284031215611be357600080fd5b813560ff8116811461119957600080fd5b600080600060608486031215611c0957600080fd5b611c1284611b7e565b9250611c2060208501611b7e565b9150604084013590509250925092565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016810167ffffffffffffffff81118282101715611ca657611ca6611c30565b604052919050565b600067ffffffffffffffff831115611cc857611cc8611c30565b611cf960207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f86011601611c5f565b9050828152838383011115611d0d57600080fd5b828260208301376000602084830101529392505050565b600060208284031215611d3657600080fd5b813567ffffffffffffffff811115611d4d57600080fd5b8201601f81018413611d5e57600080fd5b61190784823560208401611cae565b600060208284031215611d7f57600080fd5b61119982611b7e565b60008060408385031215611d9b57600080fd5b611da483611b7e565b915060208301358015158114611db957600080fd5b809150509250929050565b60008060008060808587031215611dda57600080fd5b611de385611b7e565b9350611df160208601611b7e565b925060408501359150606085013567ffffffffffffffff811115611e1457600080fd5b8501601f81018713611e2557600080fd5b611e3487823560208401611cae565b91505092959194509250565b600080600080600060a08688031215611e5857600080fd5b853594506020611e69818801611b7e565b945060408701359350606087013567ffffffffffffffff80821115611e8d57600080fd5b818901915089601f830112611ea157600080fd5b813581811115611eb357611eb3611c30565b8060051b9150611ec4848301611c5f565b818152918301840191848101908c841115611ede57600080fd5b938501935b83851015611efc57843582529385019390850190611ee3565b999c989b50969960800135979650505050505050565b60008060408385031215611f2557600080fd5b611f2e83611b7e565b9150611f3c60208401611b7e565b90509250929050565b600181811c90821680611f5957607f821691505b602082108103611f92577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b601f821115610c1657600081815260208120601f850160051c81016020861015611fbf5750805b601f850160051c820191505b81811015610b1057828155600101611fcb565b815167ffffffffffffffff811115611ff857611ff8611c30565b61200c816120068454611f45565b84611f98565b602080601f83116001811461205f57600084156120295750858301515b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600386901b1c1916600185901b178555610b10565b6000858152602081207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08616915b828110156120ac5788860151825594840194600190910190840161208d565b50858210156120e857878501517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600388901b60f8161c191681555b5050505050600190811b01905550565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000821982111561213a5761213a6120f8565b500190565b6000817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0483118215151615612177576121776120f8565b500290565b6000835161218e818460208801611adc565b8351908301906121a2818360208801611adc565b01949350505050565b600073ffffffffffffffffffffffffffffffffffffffff8087168352808616602084015250836040830152608060608301526121ea6080830184611b08565b9695505050505050565b60006020828403121561220657600080fd5b815161119981611a91565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8203612271576122716120f8565b506001019056fea2646970667358221220bcbc7df64fc593a1ee5a4d1b1a4c8cd497c162aca0fd012e3bf6f49dcfec102364736f6c634300080f0033";

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
