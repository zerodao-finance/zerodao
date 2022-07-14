import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { ethers } from "ethers";
import { BridgeLoadingGateway } from "./bridge.loading.gateway";
import { useBridgePage } from "../../../api/global/interfaces/interface.bridge";
import { BitcoinQR } from "../../atoms/helpers/BitcoinQR";

export const BridgeGatewayConfirmation = ({
  transferRequest,
  gatewayAddress,
}) => {
  const transferAmount = ethers.utils.formatUnits(
    ethers.BigNumber.from(transferRequest.amount),
    8
  );
  return (
    <>
      <div className="flex flex-col justify-center items-center gap-5 min-h-[290px] text-black dark:text-zero-neon-green-500">
        <BitcoinQR bitcoinAddress={gatewayAddress} amount={transferAmount} />
        <p className="cursor-copy select-all">{gatewayAddress}</p>
        <div
          id="usage"
          className="text-[11px] indent max-w-[300px] text-main-green dark:text-zero-neon-green-500 justify-self-end"
        >
          <p>
            Reminder: deposit exactly {transferAmount} amount of BTC indicated
            to the deposit address
          </p>
        </div>
        <div
          id="disclaimer"
          className="text-[9px] max-w-[300px] text-gray-500 dark:text-gray-300 justify-self-end"
        >
          <p>
            Please note, this tool is in beta and subject to further
            improvements and changes. Use this tool at your discretion and never
            deposit more funds than you could afford to lose
          </p>
        </div>
      </div>
    </>
  );
};
