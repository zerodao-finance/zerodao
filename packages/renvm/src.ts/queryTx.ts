import { utils, generateTransactionHash } from "@renproject/utils";
import axios from "axios";

export const queryTx = async (selector, object) => {
  const packed = await getPack(object);
  const version = "1";
  const hash = await utils.toURLBase64(
    generateTransactionHash(version, selector, packed)
  );
  const queryTx = async () => {
    const response = await axios.post("https://rpc.renproject.io", {
      method: "ren_queryTx",
      id: 1,
      jsonrpc: "2.0",
      params: {
        txHash: hash,
      },
    });
    return response.data.result;
  };

  const result = await queryTx();
  console.log(result);
  return result;
};

export const getPack = async (object) => {
  const packValue: any = {
    t: {
      struct: [
        {
          txid: "bytes",
        },
        {
          txindex: "u32",
        },
        {
          amount: "u256",
        },
        {
          payload: "bytes",
        },
        {
          phash: "bytes32",
        },
        {
          to: "string",
        },
        {
          nonce: "bytes32",
        },
        {
          nhash: "bytes32",
        },
        {
          gpubkey: "bytes",
        },
        {
          ghash: "bytes32",
        },
      ],
    },
    v: {
      amount: object.amount,
      ghash: object.ghash,
      gpubkey: object.gpubkey,
      nhash: object.nhash,
      nonce: object.nonce,
      payload: object.payload,
      phash: object.phash,
      to: object.to,
      txid: object.txid,
      txindex: object.txindex,
    },
  };
  return packValue;
};
