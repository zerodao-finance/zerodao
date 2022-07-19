# Files/Functions/Utilites directly used by zeroBRIDGE and zero-keeper

## zero-protocol: 

- UnderwriterRequest.ts **In sdk**
  - MetaRequest.ts **In sdk**
- quotes.js **In sdk**
- TransferRequest.ts **In sdk**
- BurnRequest.ts **In sdk**
- { EIP712_TYPES } from "zero-protocol/dist/lib/config/constants" \ **In common**
- fixtures from "zero-protocol/lib/fixtures" **In constants**
- deployments.json **In Common**
- { createZeroUser, createZeroConnection } from "zero-protocol/dist/lib/zero.js"
- { enableGlobaleMockRuntime, createMockKeeper } from "zero-protocol/dist/lib/mock" 
- { makeCompute } from "zero-protocol/lib/badger" 
- Logger 

## zeroBRIDGE:

- sdk.js, at least ({ sdkBurn, sdkTransfer })
- { deploymentsFromSigner } from "./zero";
- { tokenMapping, selectFixture, chainIdToName, DECIMALS, available_chains } from "utils/tokenMapping.js"
- network.js, formatters.js, walletModal.js, chains.js from utils

## zero-keeper:

- All Packages

## Add README.md

- All packages

## Add dependencies for all files above
