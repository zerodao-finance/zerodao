"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.overrideContractCalls = exports.overrideContractCall = exports.OverrideContractCallError = exports.payloadToMintABI = exports.payloadToABI = void 0;
const utils_1 = require("@renproject/utils");
const mintABITemplate = {
    constant: false,
    inputs: [
        {
            name: "_amount",
            type: "uint256",
        },
        {
            name: "_nHash",
            type: "bytes32",
        },
        {
            name: "_sig",
            type: "bytes",
        },
    ],
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function",
};
const tupleRegex = /tuple\(([a-zA-Z0-9]+(,[a-zA-Z0-9]+)*)\)/;
/**
 * If the type of an Ethereum arg matches `tuple(...)`, then it needs to include
 * a `components` array that provides the name and type of each of the tuple's
 * values. If it wasn't included, `fixTuple` will create the components array.
 */
const fixTuple = (argument) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { value, ...args } = argument;
    try {
        // If type is `tuple(...)` but components haven't been
        // been passed in, add them.
        const match = args && args.type && tupleRegex.exec(args.type);
        if (match && !argument.components) {
            const types = match[1].split(",");
            const components = [];
            for (let i = 0; i < types.length; i++) {
                components[i] = {
                    name: String(i),
                    type: types[i],
                };
            }
            return {
                ...args,
                components,
            };
        }
    }
    catch (error) {
        console.error(error);
    }
    return args;
};
const payloadToABI = (methodName, payload) => {
    // Type validation
    (0, utils_1.assertType)("string", { methodName });
    (payload || []).map(({ type, name }) => (0, utils_1.assertType)("string", { type, name }));
    return [
        {
            name: methodName,
            type: "function",
            stateMutability: "payable",
            inputs: [
                ...(payload || []).map(fixTuple).map((value) => ({
                    type: value.type,
                    name: value.name,
                    ...(value.components
                        ? {
                            components: value.components,
                        }
                        : undefined),
                })),
            ],
            outputs: [],
        },
    ];
};
exports.payloadToABI = payloadToABI;
const payloadToMintABI = (methodName, payload) => {
    // Type validation
    (0, utils_1.assertType)("string", { methodName });
    (payload || []).map(({ type, name }) => (0, utils_1.assertType)("string", { type, name }));
    return {
        ...mintABITemplate,
        name: methodName,
        inputs: [
            ...(payload || []).map(fixTuple).map((value) => ({
                type: value.type,
                name: value.name,
                ...(value.components
                    ? {
                        components: value.components,
                    }
                    : undefined),
            })),
            ...(mintABITemplate.inputs ? mintABITemplate.inputs : []),
        ],
    };
};
exports.payloadToMintABI = payloadToMintABI;
var OverrideContractCallError;
(function (OverrideContractCallError) {
    OverrideContractCallError["OverrideArrayLengthError"] = "Contract call override must be same length as contract calls array.";
})(OverrideContractCallError = exports.OverrideContractCallError || (exports.OverrideContractCallError = {}));
const overrideContractCall = (contractCall, override) => {
    const overrideParams = (override.contractParams || []).reduce((acc, param) => {
        if (param.name) {
            acc[param.name] = param;
        }
        return acc;
    }, {});
    let txConfig;
    if (typeof contractCall.txConfig === "object" &&
        typeof override.txConfig === "object") {
        txConfig = {
            ...contractCall.txConfig,
            ...override.txConfig,
        };
    }
    else {
        txConfig = override.txConfig || contractCall.txConfig;
    }
    return {
        ...contractCall,
        ...override,
        // Clone txConfig
        txConfig,
        // Clone contractParams
        values: {
            ...contractCall.values,
            ...overrideParams,
        },
    };
};
exports.overrideContractCall = overrideContractCall;
const overrideContractCalls = (contractCalls, override) => {
    if (Array.isArray(override) && override.length !== contractCalls.length) {
        throw new Error(OverrideContractCallError.OverrideArrayLengthError);
    }
    return contractCalls.map((contractCall, i) => {
        const contractCallOverride = Array.isArray(override)
            ? // If override is an array, there should be an array for each call.
                override[i]
            : // If there's only one override, apply it to the last contract call.
                i === contractCalls.length - 1
                    ? override
                    : // Default to empty object.
                        {};
        return (0, exports.overrideContractCall)(contractCall, contractCallOverride);
    });
};
exports.overrideContractCalls = overrideContractCalls;
//# sourceMappingURL=abi.js.map