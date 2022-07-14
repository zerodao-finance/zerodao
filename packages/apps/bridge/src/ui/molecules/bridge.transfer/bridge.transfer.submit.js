import { PrimaryRoundedButton } from "../../atoms/buttons/button.rounded";
import { useZero } from "../../../api/global/interfaces/interfaces.zero";
import { useEffect, useState } from "react";
import {
  getTransferOutput,
  getFeeBreakdown,
} from "../../../api/hooks/transfer-fees";
import { BridgeFeeInformation } from "./bridge.transfer.feeInformation";

export const BridgeTransferSubmit = ({
  action,
  amount,
  token,
  btc_usd,
  chainId,
}) => {
  const { keeper } = useZero();
  const [buttonLabel, setButtonLabel] = useState("Input Valid Amount");
  const [active, setActive] = useState(false);
  const [transferOutput, setTransferOutput] = useState();
  const [fees, setFees] = useState({});

  useEffect(async () => {
    if (amount > 0) {
      const output = await getTransferOutput({ amount, token, chainId });
      const feeAmounts = await getFeeBreakdown({ amount, chainId });
      setFees(feeAmounts);
      setTransferOutput(output);
    }
  }, [amount, token, chainId]);

  useEffect(async () => {
    setActive(false);
    if (amount <= 0) {
      setButtonLabel("Input Valid Amount");
    } else if (keeper.length > 0) {
      if (transferOutput > 0) {
        setButtonLabel("Transfer Funds");
        setActive(true);
      } else {
        setButtonLabel("Result Must Be More Than Zero");
      }
    } else {
      setButtonLabel("Awaiting Keeper");
    }
  }, [keeper, transferOutput, amount]);

  return (
    <>
      <div className="px-8">
        <PrimaryRoundedButton
          active={active}
          label={buttonLabel}
          action={action}
        />
      </div>

      <div
        className={
          "animate-flip-in-hor-top px-6 mt-6 [animation-delay:700ms] w-full " +
          (active ? "" : "hidden")
        }
      >
        <BridgeFeeInformation {...fees} btc_usd={btc_usd} type="transfer" />
      </div>
    </>
  );
};
