import { ReactComponent as BTC } from "../../../assets/svg-coins/btc.svg";
import { DefaultInput } from "../../atoms";
import { formatUSDCPricedBTC } from "../../../api/utils/formatters";

function BridgeTransferFrom({ amount, effect, btc_usd }) {
  return (
    <>
      <div className="w-100 flex items-center justify-between gap-5 dark:bg-badger-gray-500 bg-gray-100 px-2 rounded-2xl">
        <div className="flex items-center pl-2 w-full">
          <p className="text-xs text-gray-300 whitespace-nowrap">FROM</p>
          <div className="inline-flex justify-center max-w-[100%] rounded-md pl-4 py-2 bg-transparent text-sm font-medium text-badger-white-400 justify-between w-full focus:outline-none">
            <span className="flex items-center gap-2 max-w-[100%] w-full">
              <BTC className="w-[4rem] h-[2rem] fill-gray-400" />
              <p className="dark:text-badger-white-400 text-gray-500">BTC</p>
              <DefaultInput value={amount} onChange={effect} maxW="150px" />
            </span>
          </div>
        </div>
      </div>
      <div className=" xl:mr-5 italic tracking-wider w-full text-right text-xs -mt-2 text-zero-neon-green-500">
        ~ {formatUSDCPricedBTC(amount, btc_usd)}
      </div>
    </>
  );
}

export default BridgeTransferFrom;
