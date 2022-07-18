# Files/Functions/Utilites directly used by zeroBRIDGE and zero-keeper

## zero-protocol: 

- UnderwriterRequest.ts **Added to sdk package**
  - MetaRequest.ts **Added to sdk package**
- quotes.js **Added to sdk package**
- TransferRequest.ts **Added to sdk package**
- BurnRequest.ts **Added to sdk package**
- { EIP712_TYPES } from "zero-protocol/dist/lib/config/constants" **Added to common package**
- fixtures from "zero-protocol/lib/fixtures" **Added to common package**
- deployments.json **Added to common package**
- { createZeroUser, createZeroConnection } from "zero-protocol/dist/lib/zero.js"
- { enableGlobaleMockRuntime, createMockKeeper } from "zero-protocol/dist/lib/mock" **Added to mocks package**
- { makeCompute } from "zero-protocol/lib/badger" **Added to common package**
- Logger **Added as own Package**

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
