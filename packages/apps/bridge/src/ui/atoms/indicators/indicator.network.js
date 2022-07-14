import { FaConnectdevelop } from "react-icons/fa";

export const NetworkIndicator = ({ keeper }) => {
  return (
    <div>
      <FaConnectdevelop
        data-tooltip-target="tooltip-keepers"
        data-tooltip-placement="left"
        className={`w-[24px] h-[24px] animate-[spin_5s_linear_infinite] ${
          keeper.length > 0 ? "fill-zero-green-500" : "fill-alert-red"
        }`}
      />
      <div
        id="tooltip-keepers"
        role="tooltip"
        className="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-badger-white-400 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
      >
        {keeper.length > 0 ? "Keeper Connected" : "Searching For Keepers"}
        <div className="tooltip-arrow" data-popper-arrow></div>
      </div>
    </div>
  );
};
