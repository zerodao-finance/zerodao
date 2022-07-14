import React from "react";
import { Link } from "react-router-dom";

function NavigationBridgeToggle() {
  return (
    <div
      className={`w-full rounded-t-lg grid grid-cols-2 mb-8 bg-badger-gray-400 align-center font-light text-sm text-center max-h-11 min-w-[370px]`}
    >
      <Link to="/transfer">
        <div
          data-testid="nav-transfer-toggle"
          className={`py-2.5 rounded-tl-lg cursor-pointer ${
            window.location.hash.includes("/transfer")
              ? "transition ease-in-out duration-150 text-black border-b-2 border-zero-green-500 dark:text-zero-neon-green-500 font-bold"
              : "transition ease-in-out duration-150 text-black border-b-2 border-transparent hover:bg-zero-green-500/10 dark:text-badger-gray-600 font-bold"
          }`}
        >
          TRANSFER
        </div>
      </Link>
      <Link to="/release">
        <div
          data-testid="nav-release-toggle"
          className={`py-2.5 rounded-tr-lg cursor-pointer ${
            window.location.hash.includes("/release")
              ? "transition ease-in-out duration-150 text-black border-b-2 border-zero-green-500 dark:text-zero-neon-green-500 font-bold"
              : "transition ease-in-out duration-150 text-black border-b-2 border-transparent hover:bg-zero-green-500/10 dark:text-badger-gray-600 font-bold"
          }`}
        >
          RELEASE
        </div>
      </Link>
    </div>
  );
}

export default NavigationBridgeToggle;
