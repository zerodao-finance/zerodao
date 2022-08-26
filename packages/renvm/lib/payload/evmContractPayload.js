"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rawEncode = exports.fixEVMTransactionConfig = exports.contractPayloadHandler = void 0;
const utils_1 = require("@renproject/utils");
const abi_1 = require("@ethersproject/abi");
const ethers_1 = require("ethers");
const abi_2 = require("./abi");
const utils_2 = require("ethers/lib/utils");
const evmParams_1 = require("./evmParams");
// Replace contract address and parameter values with Ren parameters.
const resolveEVMContractParams = async (payload, evmParams) => {
    return {
        ...payload,
        params: {
            ...payload.params,
            to: await (0, evmParams_1.replaceRenParam)(payload.params.to, evmParams),
            params: await Promise.all(payload.params.params.map(async (value) => ({
                ...value,
                value: await (0, evmParams_1.replaceRenParam)(value.value, evmParams),
            }))),
        },
    };
};
exports.contractPayloadHandler = {
    getSetup: ({ payload }) => payload.setup || {},
    getPayload: async ({ network, payload, evmParams, }) => {
        try {
            payload = await resolveEVMContractParams(payload, evmParams);
        }
        catch (error) {
            throw utils_1.ErrorWithCode.updateError(error, utils_1.RenJSError.PARAMETER_ERROR, `Error getting contract-call payload`);
        }
        const args = payload.params.params.filter((arg) => !arg.notInPayload);
        for (const arg of args) {
            if (arg.value === undefined) {
                if (arg.renParam) {
                    throw new utils_1.ErrorWithCode(`Payload parameter '${arg.name}' is undefined. (Did you accidentally set 'withRenParams' for a burn?)`, utils_1.RenJSError.PARAMETER_ERROR);
                }
                throw new utils_1.ErrorWithCode(`Payload parameter '${arg.name}' is undefined.`, utils_1.RenJSError.PARAMETER_ERROR);
            }
        }
        if (payload.params.to === undefined) {
            throw new utils_1.ErrorWithCode(`Payload 'to' is undefined.`, utils_1.RenJSError.PARAMETER_ERROR);
        }
        const types = args.map(({ value: _, ...params }) => params);
        const values = args.map((param) => param.value);
        let p;
        try {
            p = (0, exports.rawEncode)(types, values);
        }
        catch (error) {
            throw new utils_1.ErrorWithCode(error, utils_1.RenJSError.PARAMETER_ERROR, `Error encoding ${network.selector} parameters`);
        }
        return {
            to: payload.params.to,
            toBytes: utils_1.utils.fromHex(payload.params.to),
            payload: p,
        };
    },
    export: async ({ network, signer, payload, evmParams, overrides, }) => {
        try {
            payload = await resolveEVMContractParams(payload, evmParams);
        }
        catch (error) {
            throw utils_1.ErrorWithCode.updateError(error, utils_1.RenJSError.PARAMETER_ERROR, `Error resolving parameters for contract-call`);
        }
        // Get parameter values, checking first if each value has been
        // overridden.
        const params = payload.params.params.map((x) => overrides.overrides && utils_1.utils.isDefined(overrides.overrides[x.name])
            ? {
                ...x,
                value: overrides.overrides[x.name],
            }
            : x);
        const paramTypes = params.map(({ value: _value, ...paramABI }) => paramABI);
        const paramValues = params.map((x) => x.value);
        for (const param of params) {
            if (param.value === undefined) {
                throw utils_1.ErrorWithCode.updateError(new Error(`Parameter '${param.name}' is undefined.`), utils_1.RenJSError.PARAMETER_ERROR);
            }
        }
        try {
            (0, exports.rawEncode)(paramTypes, paramValues);
        }
        catch (error) {
            throw new utils_1.ErrorWithCode(error, utils_1.RenJSError.PARAMETER_ERROR, `Error encoding ${network.selector} parameters`);
        }
        const abi = (0, abi_2.payloadToABI)(payload.params.method, params)[0];
        if (!abi.name) {
            throw new Error(`ABI must include method name.`);
        }
        const contract = new ethers_1.Contract(payload.params.to.toLowerCase(), [abi], signer);
        return await contract.populateTransaction[abi.name](...paramValues, (0, exports.fixEVMTransactionConfig)(payload.txConfig, payload.params.txConfig, overrides.txConfig));
    },
};
const fixEVMTransactionConfig = (...txConfigs) => {
    let result = {};
    for (const txConfig of txConfigs) {
        result = {
            ...result,
            ...txConfig,
        };
        if (utils_1.utils.isDefined(result.value)) {
            result.value = result.value.toString();
        }
        if (utils_1.utils.isDefined(result.gasPrice)) {
            result.gasPrice = result.gasPrice.toString();
        }
    }
    return result;
};
exports.fixEVMTransactionConfig = fixEVMTransactionConfig;
const tupleRegEx = /^tuple\((.*)\)$/;
const rawEncode = (types, parameters) => {
    return utils_1.utils.fromHex(utils_2.defaultAbiCoder.encode(types.map((type) => {
        // If a tuple has no components, set them.
        if (typeof type === "object" && !type.components) {
            const match = tupleRegEx.exec(type.type || "");
            if (match) {
                type = {
                    ...type,
                    components: match[1].split(",").map((value) => ({
                        type: value,
                    })),
                };
            }
        }
        return abi_1.ParamType.from(type);
    }), parameters));
};
exports.rawEncode = rawEncode;
//# sourceMappingURL=evmContractPayload.js.map