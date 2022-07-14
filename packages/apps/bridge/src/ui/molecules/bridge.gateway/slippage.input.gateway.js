import { useEffect, useState } from "react";
import { CogIcon } from "@heroicons/react/outline";
import OutsideClickHandler from "react-outside-click-handler";

export const isStringFloat = (strNumber) => {
  const res = !isNaN(strNumber) && strNumber.toString().indexOf(".") != -1;
  return res;
};

export const SlippageInput = ({ token, slippage, setSlippage }) => {
  const [openSetting, setOpenSetting] = useState(false);
  const [valid, setValid] = useState(true);

  const autoSlippage = () => {
    switch (token) {
      case "renBTC":
        setSlippage("0.0");
        break;
      case "USDC":
        setSlippage("5.0");
        break;
      case "ETH":
        setSlippage("10.0");
        break;
      case "AVAX":
        setSlippage("10.0");
        break;
      default:
        setSlippage("2.0");
    }
  };

  useEffect(() => {
    if (!valid && !openSetting) {
      autoSlippage();
    }
  }, [openSetting]);

  // Perform form validation when slippage changes
  useEffect(() => {
    setValid(isStringFloat(slippage));
  }, [slippage]);

  // Reset to default on token switch
  useEffect(() => {
    autoSlippage();
  }, [token]);

  return (
    <OutsideClickHandler onOutsideClick={() => setOpenSetting(false)}>
      <div className="w-full flex justify-end">
        <CogIcon
          onClick={() => setOpenSetting(!openSetting)}
          className="h-6 w-6 cursor-pointer"
        />
        <div
          className={
            "bg-badger-black-400 absolute z-20 mt-8 select-none p-4 rounded-lg text-badger-white grid " +
            (openSetting ? "" : "hidden")
          }
        >
          <span className="text-sm font-semibold text-badger-text-secondary">
            Transaction settings
          </span>
          <label htmlFor="slipTolerance" className="text-sm mt-2">
            Slippage tolerance ?
          </label>
          <div className="flex mt-1 text-sm">
            <button
              className="hover:bg-zero-green-500/40 bg-zero-green-500/90 rounded-lg p-2 font-bold text-badger-white-400"
              onClick={() => autoSlippage()}
            >
              Auto
            </button>
            <input
              type="number"
              name="slipTolerance"
              id="slipTolerance"
              className={
                "block rounded-lg ml-2 text-right border-1 ring-1 text-badger-black-800 pr-7 font-semibold " +
                (valid
                  ? "focus:border-badger-gray-200 focus:ring-badger-gray-200 ring-transparent"
                  : "border-error-red-400 ring-error-red-400 focus:ring-error-red-400 focus:border-error-red-400")
              }
              placeholder="0.1"
              value={slippage}
              onChange={(e) => setSlippage(e.target.value)}
            />
            <div className="absolute pt-3 right-3 pr-3 flex items-center pointer-events-none text-badger-black-800 font-bold">
              %
            </div>
          </div>
        </div>
      </div>
    </OutsideClickHandler>
  );
};
