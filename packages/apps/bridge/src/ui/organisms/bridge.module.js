import { BridgeTransferModule } from "../molecules/bridge.transfer";
import { BridgeBurnModule } from "../molecules/bridge.burn/bridge.burn";
import { BridgeLoadingWallet } from "../molecules/bridge.transfer/bridge.loading.wallet";
import { useBridgeInput } from "../../api/global/interfaces/interface.bridge.transfer";
import { useBridgeBurnInput } from "../../api/global/interfaces/interface.bridge.burn";
import { useBridgePage } from "../../api/global/interfaces/interface.bridge";
import Disclaimer from "./Disclaimer";
import { Route, Routes, Link } from "react-router-dom";
import { SlippageInput } from "../molecules/bridge.gateway/slippage.input.gateway";
import NavigationBridgeToggle from "../molecules/navigation/navigation.bridge.toggle";

export const BridgeModule = ({ wallet }) => {
  const { getTransferMode, getTransferSlippageProps } = useBridgeInput();
  const { getBurnSlippageProps } = useBridgeBurnInput();
  const { getBridgePageProps } = useBridgePage();
  const { tcSigned } = getBridgePageProps();

  return !tcSigned ? (
    <Disclaimer />
  ) : (
    <div className="h-fit w-fit pb-8 grid bg-badger-black-500 rounded-lg justify-center text-badger-white-400 min-w-[370px]">
      <NavigationBridgeToggle />
      <span className="grid px-8">
        {wallet ? (
          <BridgeLoadingWallet />
        ) : (
          <>
            <Routes>
              <Route
                path="/transfer/*"
                element={
                  <div className="grid">
                    <span className="w-full select-none">
                      <SlippageInput {...getTransferSlippageProps()} />
                    </span>
                    <BridgeTransferModule {...getTransferMode()} />
                  </div>
                }
              />
              <Route
                path="/release/*"
                element={
                  <div className="grid">
                    <span className="w-full select-none">
                      <SlippageInput {...getBurnSlippageProps()} />
                    </span>
                    <BridgeBurnModule />
                  </div>
                }
              />
            </Routes>
          </>
        )}
      </span>
    </div>
  );
};
