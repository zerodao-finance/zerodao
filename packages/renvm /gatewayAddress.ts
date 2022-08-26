import { createAddressArray } from "packages/chains/chains-bitcoin/src/script";
import { hash160 } from "packages/chains/chains-bitcoin/src/utils/utils";
export const getGatewayAddress = async (fromChain, asset, from, gPubKey, gHash) => {
    await fromChain.createGatewayAddress(
        asset,
        from,
        gPubKey,
        gHash,
    );
    const gatewayAddress = await fromChain.addressFromBytes(
        createAddressArray(
            hash160(gPubKey),
            gHash,
            fromChain.network.p2shPrefix,
        ),
    );
    return gatewayAddress;
}