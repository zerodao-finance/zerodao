import { useEffect, useState } from "react";
import { UnderwriterTransferRequest } from "zero-protocol/dist/lib/zero";
import { fallbackMint } from "../utils/fallback";
import { getSigner } from "../hooks/submit";
import { useRequestHelper } from "../hooks/helper";

export const getStatus = (data) => {
  const [passed, setPassed] = useState(null);
  const { state } = useRequestHelper();
  const { wallet } = state;

  useEffect(async () => {
    const req = new UnderwriterTransferRequest({
      ...data._data,
    });

    const signer = await getSigner(wallet);
    const mint = await req.submitToRenVM();

    if (!process.env.REACT_APP_TEST) {
      mint.on("deposit", async (deposit) => {
        let confs = deposit.depositDetails.transaction.confirmations;

        let passedData = {
          target: 6,
          confs: await confs,
          fallbackMint:
            confs && confs > 6 ? () => fallbackMint(req, signer) : null,
        };

        setPassed(passedData);
      });
    }
  }, []);

  return { passed };
};
