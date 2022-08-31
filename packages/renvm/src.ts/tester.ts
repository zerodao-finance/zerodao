import { TransferRequest } from "../../request";
import { getPack } from "./processDeposit";
import { utils } from "@renproject/utils";
import { BigNumber } from "bignumber.js";
import { getTxDetails } from "./transaction";
(async () => {
  /* let req = await new TransferRequest({
    to: "0xd612D8729a39c9Ad011Af1b48011A0260Ef37B06",
    module: "0x0000000000000000000000000000000000000000",
    data: "0x00000000000000000000000000000000000000000000000000b3dfa5d664c940",
    amount: "0x07a120",
    nonce: "0x353466c3ad05b5e8df3fe94e42c4be6ff11ed6e6663a607e837f1c38d93cafa7",
    pNonce:
      "0x4ce017042614542c44e784a04bc9a168740b6a7323ff160f6b5b1c7f911c4a23",
    contractAddress: "0xa8bd3ffebf92538b3b830dd5b2516a5111db164d",
    asset: "0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D",
    underwriter: "0xa8bd3ffebf92538b3b830dd5b2516a5111db164d"
  }); 
  const results: any = await req.getRenTx();
  results.map(result => console.log(result)); 
  
  const getNonce = async nonce => {
    const nonceBytes =
      typeof nonce === "string"
        ? utils.fromBase64(nonce)
        : utils.toNBytes(nonce || 0, 32);
    return nonceBytes;
  }; */
  // const asset = "renBTC"
  const selector = "BTC/toEthereum";
  const asset = "BTC";
  const paramsAlo = {
    amount: "12500000000",
    ghash: "IQKXAq4tgk3VOwVPaXFZ2_EQo1tAp7RO9PBmjID1ZmQ",
    gpubkey: "A6Auk8-MR7JQB1sK9h-W69EDdsCqp2NRSOiJyytRyWkn",
    nhash: "SOguzsPz8_UJ-mCd-0JqKaNgLOmhf2EKiaQISlpBvfk",
    nonce: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEisfg",
    payload:
      "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAABsE_oSAVGsH0OCK61818Q8-zr39AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADQlRDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    phash: "X8vBrH1RiD19ovYfl9-H8tAkY-hK3xS-bSBqo-2DvLk",
    to: "32666B64e9fD0F44916E1378Efb2CFa3B3B96e80",
    // txid: "dsyooQhZ8vleJGXclhDHnCh1TlJ5pFmWLpzf7XphtDs",
    txid: "bFfLZQeNWB-rZi8LtaCNDZq9seKK_LzyqHL3Na2w4PU",
    txindex: "0",
  };
  const result = await getTxDetails("Bitcoin", paramsAlo, asset, selector);
  console.log(result);
})();
