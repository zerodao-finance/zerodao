import { TransferRequest } from "../../request";
(async () => {
  let req = await new TransferRequest({
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
})();
