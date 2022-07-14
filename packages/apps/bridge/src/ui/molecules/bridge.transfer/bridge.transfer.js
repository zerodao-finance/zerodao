import { BridgeTransferFee } from "./bridge.transfer.fee";
import { BridgeTransferSubmit } from "./bridge.transfer.submit";
import { BridgeLoadingSignature } from "./bridge.loading.signature";
import { BridgeLoadingGateway } from "./bridge.loading.gateway";
import { BridgeGatewayConfirmation } from "../bridge.gateway/bridge.gateway";
import { ArrowDownIcon } from "@heroicons/react/solid";
import { useBridgeInput } from "../../../api/global/interfaces/interface.bridge.transfer";
import BridgeTransferFrom from "./bridge.transfer.from";

export const BridgeTransferModule = ({ mode }) => {
  const { getTransferSenderProps, getTransferInputProps, getGatewayData } =
    useBridgeInput();

  if (mode === "input") {
    return (
      <>
        <div className="container h-max flex flex-row place-content-center max-w-[25rem] gap-3 md:gap-5 justify-around items-center px-1 md:px-8 z-10">
          <div className="flex flex-col w-full justify-center items-center animate-flip-in-hor-top [animation-delay:400ms]">
            <p className="text-xs pl-2 text-black dark:text-badger-text-secondary-400 opacity-60 w-full whitespace-nowrap text-left">
              transfer amount
            </p>
            <div className="flex flex-col gap-2 justify-center max-w-[100%]">
              <BridgeTransferFrom {...getTransferInputProps()} />
              <ArrowDownIcon className="fill-white w-4 self-center pt-3" />
            </div>
            <BridgeTransferFee {...getTransferInputProps()} />
          </div>
        </div>

        <div className="animate-flip-in-hor-top [animation-delay:500ms] w-full mt-4 pb-2">
          <BridgeTransferSubmit {...getTransferSenderProps()} />
        </div>
      </>
    );
  } else if (mode === "showSigning") {
    return <BridgeLoadingSignature />;
  } else if (mode === "waitingDry") {
    return <BridgeLoadingGateway />;
  } else if (mode === "showGateway") {
    return <BridgeGatewayConfirmation {...getGatewayData()} />;
  }
};
