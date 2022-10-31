export { isZcashAddress, toFixtureName, FIXTURES } from '@zerodao/common';
export * from '@zerodao/request';
export { RENVM_PROVIDERS, RPC_ENDPOINTS, CONTROLLER_DEPLOYMENTS, URLS, CHAINS, NAME_CHAIN, ID_CHAIN, } from '@zerodao/chains';
export { makeQuoter, makeCompute } from '@zerodao/compute';
import { applyRatio, computeRandomValue, getNonce, getPNonce } from '@zerodao/compute';
export * from '@zerodao/logger';
export { ZeroP2P } from '@zerodao/p2p';
import * as utilsModule from '@zerodao/utils';
export declare const DEPLOYMENTS: {
    "1": {
        mainnet: {
            name: string;
            chainId: string;
            contracts: {
                BadgerBridgeZeroController: {
                    address: string;
                    abi: ({
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        outputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                    } | {
                        stateMutability: string;
                        type: string;
                        inputs?: undefined;
                        name?: undefined;
                        outputs?: undefined;
                    })[];
                };
                BadgerBridgeZeroControllerDeployer: {
                    address: string;
                    abi: ({
                        inputs: any[];
                        stateMutability: string;
                        type: string;
                        anonymous?: undefined;
                        name?: undefined;
                    } | {
                        anonymous: boolean;
                        inputs: {
                            indexed: boolean;
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        type: string;
                        stateMutability?: undefined;
                    })[];
                };
                ConvertNativeMainnet: {
                    address: string;
                    abi: any[];
                };
                ConvertUSDCMainnet: {
                    address: string;
                    abi: string;
                };
                ConvertWBTCMainnet: {
                    address: string;
                    abi: any[];
                };
                GnosisSafe: {
                    address: string;
                    abi: any[];
                };
                RenZECController: {
                    address: string;
                    abi: ({
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        outputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                    } | {
                        stateMutability: string;
                        type: string;
                        inputs?: undefined;
                        name?: undefined;
                        outputs?: undefined;
                    })[];
                };
                ZeroBTC: {
                    address: string;
                    abi: ({
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                        name?: undefined;
                        anonymous?: undefined;
                        outputs?: undefined;
                    } | {
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        type: string;
                        stateMutability?: undefined;
                        anonymous?: undefined;
                        outputs?: undefined;
                    } | {
                        anonymous: boolean;
                        inputs: {
                            indexed: boolean;
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        type: string;
                        stateMutability?: undefined;
                        outputs?: undefined;
                    } | {
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        outputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                        anonymous?: undefined;
                    } | {
                        stateMutability: string;
                        type: string;
                        inputs?: undefined;
                        name?: undefined;
                        anonymous?: undefined;
                        outputs?: undefined;
                    })[];
                };
            };
        };
    };
    "10": {
        optimism: {
            name: string;
            chainId: string;
            contracts: {
                BadgerBridgeZeroController: {
                    address: string;
                    abi: ({
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        outputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                    } | {
                        stateMutability: string;
                        type: string;
                        inputs?: undefined;
                        name?: undefined;
                        outputs?: undefined;
                    })[];
                };
                BadgerBridgeZeroControllerDeployer: {
                    address: string;
                    abi: ({
                        inputs: any[];
                        stateMutability: string;
                        type: string;
                        anonymous?: undefined;
                        name?: undefined;
                    } | {
                        anonymous: boolean;
                        inputs: {
                            indexed: boolean;
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        type: string;
                        stateMutability?: undefined;
                    })[];
                };
            };
        };
    };
    "137": {
        matic: {
            name: string;
            chainId: string;
            contracts: {
                BTCVault: {
                    address: string;
                    abi: ({
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                        anonymous?: undefined;
                        name?: undefined;
                        outputs?: undefined;
                    } | {
                        anonymous: boolean;
                        inputs: {
                            indexed: boolean;
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        type: string;
                        stateMutability?: undefined;
                        outputs?: undefined;
                    } | {
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        outputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                        anonymous?: undefined;
                    })[];
                };
                BadgerBridgeZeroController: {
                    address: string;
                    abi: ({
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        outputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                    } | {
                        stateMutability: string;
                        type: string;
                        inputs?: undefined;
                        name?: undefined;
                        outputs?: undefined;
                    })[];
                };
                DelegateUnderwriter: {
                    address: string;
                    abi: ({
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                        anonymous?: undefined;
                        name?: undefined;
                        outputs?: undefined;
                    } | {
                        anonymous: boolean;
                        inputs: {
                            indexed: boolean;
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        type: string;
                        stateMutability?: undefined;
                        outputs?: undefined;
                    } | {
                        stateMutability: string;
                        type: string;
                        inputs?: undefined;
                        anonymous?: undefined;
                        name?: undefined;
                        outputs?: undefined;
                    } | {
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        outputs: any[];
                        stateMutability: string;
                        type: string;
                        anonymous?: undefined;
                    } | {
                        inputs: any[];
                        name: string;
                        outputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                        anonymous?: undefined;
                    })[];
                };
                DummyVault: {
                    address: string;
                    abi: ({
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                        anonymous?: undefined;
                        name?: undefined;
                        outputs?: undefined;
                    } | {
                        anonymous: boolean;
                        inputs: {
                            indexed: boolean;
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        type: string;
                        stateMutability?: undefined;
                        outputs?: undefined;
                    } | {
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        outputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                        anonymous?: undefined;
                    })[];
                };
                GnosisSafe: {
                    address: string;
                    abi: any[];
                };
                PolygonConvert: {
                    address: string;
                    abi: ({
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                        name?: undefined;
                        outputs?: undefined;
                    } | {
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        outputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                    } | {
                        stateMutability: string;
                        type: string;
                        inputs?: undefined;
                        name?: undefined;
                        outputs?: undefined;
                    })[];
                };
                StrategyRenVM: {
                    address: string;
                    abi: ({
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                        name?: undefined;
                        outputs?: undefined;
                    } | {
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        outputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                    } | {
                        stateMutability: string;
                        type: string;
                        inputs?: undefined;
                        name?: undefined;
                        outputs?: undefined;
                    })[];
                };
                Swap: {
                    address: string;
                    abi: ({
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                        name?: undefined;
                        outputs?: undefined;
                    } | {
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        outputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                    })[];
                };
                SwapOld: {
                    address: string;
                    abi: ({
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                        name?: undefined;
                        outputs?: undefined;
                    } | {
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        outputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                    })[];
                };
                TrivialUnderwriter: {
                    address: string;
                    abi: ({
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                        anonymous?: undefined;
                        name?: undefined;
                        outputs?: undefined;
                    } | {
                        anonymous: boolean;
                        inputs: {
                            indexed: boolean;
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        type: string;
                        stateMutability?: undefined;
                        outputs?: undefined;
                    } | {
                        stateMutability: string;
                        type: string;
                        inputs?: undefined;
                        anonymous?: undefined;
                        name?: undefined;
                        outputs?: undefined;
                    } | {
                        inputs: any[];
                        name: string;
                        outputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                        anonymous?: undefined;
                    } | {
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        outputs: any[];
                        stateMutability: string;
                        type: string;
                        anonymous?: undefined;
                    })[];
                };
                UnwrapNative: {
                    address: string;
                    abi: ({
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                        name?: undefined;
                        outputs?: undefined;
                    } | {
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        outputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                    } | {
                        stateMutability: string;
                        type: string;
                        inputs?: undefined;
                        name?: undefined;
                        outputs?: undefined;
                    })[];
                };
                WrapNative: {
                    address: string;
                    abi: ({
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                        name?: undefined;
                        outputs?: undefined;
                    } | {
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        outputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                    } | {
                        stateMutability: string;
                        type: string;
                        inputs?: undefined;
                        name?: undefined;
                        outputs?: undefined;
                    })[];
                };
                ZeroController: {
                    address: string;
                    abi: ({
                        anonymous: boolean;
                        inputs: {
                            indexed: boolean;
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        type: string;
                        outputs?: undefined;
                        stateMutability?: undefined;
                    } | {
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        outputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                        anonymous?: undefined;
                    })[];
                };
                ZeroControllerNew: {
                    address: string;
                    abi: ({
                        anonymous: boolean;
                        inputs: {
                            indexed: boolean;
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        type: string;
                        outputs?: undefined;
                        stateMutability?: undefined;
                    } | {
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        outputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                        anonymous?: undefined;
                    })[];
                };
                ZeroControllerOld: {
                    address: string;
                    abi: ({
                        anonymous: boolean;
                        inputs: {
                            indexed: boolean;
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        type: string;
                        outputs?: undefined;
                        stateMutability?: undefined;
                    } | {
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        outputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                        anonymous?: undefined;
                    })[];
                };
                ZeroCurveFactory: {
                    address: string;
                    abi: ({
                        anonymous: boolean;
                        inputs: {
                            indexed: boolean;
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        type: string;
                        stateMutability?: undefined;
                        outputs?: undefined;
                    } | {
                        stateMutability: string;
                        type: string;
                        anonymous?: undefined;
                        inputs?: undefined;
                        name?: undefined;
                        outputs?: undefined;
                    } | {
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        outputs: any[];
                        stateMutability: string;
                        type: string;
                        anonymous?: undefined;
                    })[];
                };
                ZeroUnderwriterLockBytecodeLib: {
                    address: string;
                    abi: {
                        inputs: any[];
                        name: string;
                        outputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                    }[];
                };
                ZeroUniswapFactory: {
                    address: string;
                    abi: ({
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                        anonymous?: undefined;
                        name?: undefined;
                        outputs?: undefined;
                    } | {
                        anonymous: boolean;
                        inputs: {
                            indexed: boolean;
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        type: string;
                        stateMutability?: undefined;
                        outputs?: undefined;
                    } | {
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        outputs: any[];
                        stateMutability: string;
                        type: string;
                        anonymous?: undefined;
                    } | {
                        inputs: any[];
                        name: string;
                        outputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                        anonymous?: undefined;
                    })[];
                };
            };
        };
    };
    "42161": {
        arbitrum: {
            name: string;
            chainId: string;
            contracts: {
                ArbitrumConvert: {
                    address: string;
                    abi: ({
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                        name?: undefined;
                        outputs?: undefined;
                    } | {
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        outputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                    } | {
                        stateMutability: string;
                        type: string;
                        inputs?: undefined;
                        name?: undefined;
                        outputs?: undefined;
                    })[];
                };
                ArbitrumConvertQuick: {
                    address: string;
                    abi: ({
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                        name?: undefined;
                        outputs?: undefined;
                    } | {
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        outputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                    } | {
                        stateMutability: string;
                        type: string;
                        inputs?: undefined;
                        name?: undefined;
                        outputs?: undefined;
                    })[];
                };
                BTCVault: {
                    address: string;
                    abi: ({
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                        anonymous?: undefined;
                        name?: undefined;
                        outputs?: undefined;
                    } | {
                        anonymous: boolean;
                        inputs: {
                            indexed: boolean;
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        type: string;
                        stateMutability?: undefined;
                        outputs?: undefined;
                    } | {
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        outputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                        anonymous?: undefined;
                    })[];
                };
                BadgerBridgeZeroController: {
                    address: string;
                    abi: ({
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        outputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                    } | {
                        stateMutability: string;
                        type: string;
                        inputs?: undefined;
                        name?: undefined;
                        outputs?: undefined;
                    })[];
                };
                DelegateUnderwriter: {
                    address: string;
                    abi: ({
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                        anonymous?: undefined;
                        name?: undefined;
                        outputs?: undefined;
                    } | {
                        anonymous: boolean;
                        inputs: {
                            indexed: boolean;
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        type: string;
                        stateMutability?: undefined;
                        outputs?: undefined;
                    } | {
                        stateMutability: string;
                        type: string;
                        inputs?: undefined;
                        anonymous?: undefined;
                        name?: undefined;
                        outputs?: undefined;
                    } | {
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        outputs: any[];
                        stateMutability: string;
                        type: string;
                        anonymous?: undefined;
                    } | {
                        inputs: any[];
                        name: string;
                        outputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                        anonymous?: undefined;
                    })[];
                };
                DummyVault: {
                    address: string;
                    abi: ({
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                        anonymous?: undefined;
                        name?: undefined;
                        outputs?: undefined;
                    } | {
                        anonymous: boolean;
                        inputs: {
                            indexed: boolean;
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        type: string;
                        stateMutability?: undefined;
                        outputs?: undefined;
                    } | {
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        outputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                        anonymous?: undefined;
                    })[];
                };
                GnosisSafe: {
                    address: string;
                    abi: any[];
                };
                MetaExecutor: {
                    address: string;
                    abi: ({
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                        name?: undefined;
                        outputs?: undefined;
                    } | {
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        outputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                    } | {
                        stateMutability: string;
                        type: string;
                        inputs?: undefined;
                        name?: undefined;
                        outputs?: undefined;
                    })[];
                };
                StrategyRenVM: {
                    address: string;
                    abi: ({
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                        name?: undefined;
                        outputs?: undefined;
                    } | {
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        outputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                    } | {
                        stateMutability: string;
                        type: string;
                        inputs?: undefined;
                        name?: undefined;
                        outputs?: undefined;
                    })[];
                };
                StrategyRenVMArbitrum: {
                    address: string;
                    abi: ({
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                        name?: undefined;
                        outputs?: undefined;
                    } | {
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        outputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                    } | {
                        stateMutability: string;
                        type: string;
                        inputs?: undefined;
                        name?: undefined;
                        outputs?: undefined;
                    })[];
                };
                TrivialUnderwriter: {
                    address: string;
                    abi: ({
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                        anonymous?: undefined;
                        name?: undefined;
                        outputs?: undefined;
                    } | {
                        anonymous: boolean;
                        inputs: {
                            indexed: boolean;
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        type: string;
                        stateMutability?: undefined;
                        outputs?: undefined;
                    } | {
                        stateMutability: string;
                        type: string;
                        inputs?: undefined;
                        anonymous?: undefined;
                        name?: undefined;
                        outputs?: undefined;
                    } | {
                        inputs: any[];
                        name: string;
                        outputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                        anonymous?: undefined;
                    } | {
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        outputs: any[];
                        stateMutability: string;
                        type: string;
                        anonymous?: undefined;
                    })[];
                };
                UnwrapNative: {
                    address: string;
                    abi: ({
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                        name?: undefined;
                        outputs?: undefined;
                    } | {
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        outputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                    } | {
                        stateMutability: string;
                        type: string;
                        inputs?: undefined;
                        name?: undefined;
                        outputs?: undefined;
                    })[];
                };
                WrapNative: {
                    address: string;
                    abi: ({
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                        name?: undefined;
                        outputs?: undefined;
                    } | {
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        outputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                    } | {
                        stateMutability: string;
                        type: string;
                        inputs?: undefined;
                        name?: undefined;
                        outputs?: undefined;
                    })[];
                };
                ZeroController: {
                    address: string;
                    abi: ({
                        anonymous: boolean;
                        inputs: {
                            indexed: boolean;
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        type: string;
                        outputs?: undefined;
                        stateMutability?: undefined;
                    } | {
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        outputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                        anonymous?: undefined;
                    })[];
                };
                ZeroCurveFactory: {
                    address: string;
                    abi: ({
                        anonymous: boolean;
                        inputs: {
                            indexed: boolean;
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        type: string;
                        stateMutability?: undefined;
                        outputs?: undefined;
                    } | {
                        stateMutability: string;
                        type: string;
                        anonymous?: undefined;
                        inputs?: undefined;
                        name?: undefined;
                        outputs?: undefined;
                    } | {
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        outputs: any[];
                        stateMutability: string;
                        type: string;
                        anonymous?: undefined;
                    })[];
                };
                ZeroUnderwriterLockBytecodeLib: {
                    address: string;
                    abi: {
                        inputs: any[];
                        name: string;
                        outputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                    }[];
                };
                ZeroUniswapFactory: {
                    address: string;
                    abi: ({
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                        anonymous?: undefined;
                        name?: undefined;
                        outputs?: undefined;
                    } | {
                        anonymous: boolean;
                        inputs: {
                            indexed: boolean;
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        type: string;
                        stateMutability?: undefined;
                        outputs?: undefined;
                    } | {
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        outputs: any[];
                        stateMutability: string;
                        type: string;
                        anonymous?: undefined;
                    } | {
                        inputs: any[];
                        name: string;
                        outputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                        anonymous?: undefined;
                    })[];
                };
            };
        };
    };
    "43114": {
        avalanche: {
            name: string;
            chainId: string;
            contracts: {
                BadgerBridgeZeroController: {
                    address: string;
                    abi: ({
                        inputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        outputs: {
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        stateMutability: string;
                        type: string;
                    } | {
                        stateMutability: string;
                        type: string;
                        inputs?: undefined;
                        name?: undefined;
                        outputs?: undefined;
                    })[];
                };
                BadgerBridgeZeroControllerDeployer: {
                    address: string;
                    abi: ({
                        inputs: any[];
                        stateMutability: string;
                        type: string;
                        anonymous?: undefined;
                        name?: undefined;
                    } | {
                        anonymous: boolean;
                        inputs: {
                            indexed: boolean;
                            internalType: string;
                            name: string;
                            type: string;
                        }[];
                        name: string;
                        type: string;
                        stateMutability?: undefined;
                    })[];
                };
            };
        };
    };
};
declare const utils: {
    applyRatio: typeof applyRatio;
    computeRandomValue: typeof computeRandomValue;
    getNonce: typeof getNonce;
    getPNonce: typeof getPNonce;
} & typeof utilsModule;
export { utils };
