import { Fragment, useEffect } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { ReactComponent as ETH } from "../../../assets/svg-coins/eth.svg";
import { ReactComponent as renBTC } from "../../../assets/svg-coins/renbtc.svg";
import { ReactComponent as WBTC } from "../../../assets/svg-coins/wbtc.svg";
import { ReactComponent as ibBTC } from "../../../assets/svg-coins/ibbtc.svg";
import { ReactComponent as USDC } from "../../../assets/svg-coins/usdc.svg";
import { ReactComponent as AVAX } from "../../../assets/svg-coins/avax.svg";
import { ReactComponent as MATIC } from "../../../assets/svg-coins/matic.svg";
import { useLocation } from "react-router-dom";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

/*
* How to use 'TokenDropdown' component
* Create 'useState' variables and pass it to 'TokenDropdown'
* (props are 'token' and 'setToken' where 'token' is a string of the token symbol)

* Additional Props: 'tokensRemoved' which is an array of tokens you do not want in dropdown
* Default Dropdown Items: ETH, WBTC, ibBTC, renBTC, USDC
*/
function TokenDropdown({
  token = "renBTC",
  setToken,
  tokensRemoved = [],
  tokensDisabled = [],
}) {
  const location = useLocation();

  const items = [
    {
      text: "renBTC",
      icon: renBTC,
    },
    {
      text: "WBTC",
      icon: WBTC,
    },
    {
      text: "ibBTC",
      icon: ibBTC,
    },
    {
      text: "ETH",
      icon: ETH,
    },
    {
      text: "AVAX",
      icon: AVAX,
    },
    {
      text: "MATIC",
      icon: MATIC,
    },
    {
      text: "USDC",
      icon: USDC,
    },
  ];

  const determineIcon = (_token) => {
    const icon = items.map((item, index) => {
      if (item.text.toLowerCase() === _token.toLowerCase()) {
        return <item.icon key={index} className="h-8 w-8 fill-gray-400 mr-3" />;
      }
    });
    return icon;
  };

  // For Routing
  useEffect(() => {
    if (
      window.location.hash === "#/transfer" ||
      window.location.hash === "#/release"
    ) {
      window.location.hash = window.location.hash + "/" + token;
    } else {
      const base = window.location.hash.split("/");
      window.location.hash = base[0] + "/" + base[1] + "/" + token;
    }
  }, [token]);

  useEffect(() => {
    const base = window.location.hash.split("/");
    if (base.length === 3) {
      setToken(base[2]);
    }
  }, [location]);

  return (
    <Menu as="div" className="relative inline-block text-left max-w-[100%]">
      <Menu.Button
        className="inline-flex justify-center w-full rounded-md px-4 py-2 bg-transparent text-sm font-medium text-badger-white-400 items-center focus:outline-none justify-between"
        style={{ minWidth: "150px" }}
      >
        <span className="flex items-center max-w-[100%]">
          {determineIcon(token)}
          <p className="dark:text-badger-white-400 text-gray-500">{token}</p>
        </span>
        <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          data-testid="token-dropdown"
          className="z-50 origin-top-right py-1 absolute w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none"
        >
          {items
            .filter((el) => !tokensRemoved.includes(el.text))
            .map((item, index) => (
              <div
                key={index}
                onClick={(e) => {
                  if (!tokensDisabled.includes(e.target.innerText)) {
                    setToken(e.target.innerText);
                  }
                }}
              >
                <Menu.Item>
                  {({ active }) => (
                    <div
                      className={classNames(
                        active && !tokensDisabled.includes(item.text)
                          ? "bg-zero-green-500 text-black font-medium"
                          : "text-gray-700",
                        tokensDisabled.includes(item.text)
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer",
                        "flex items-center px-4 py-2 text-sm transition duration-300"
                      )}
                    >
                      <item.icon
                        key={`${index}-${item.text}`}
                        className="mr-3 h-6 w-6 group-hover:text-gray-500 text-gray-400"
                        aria-hidden="true"
                      />
                      <span>{item.text}</span>
                    </div>
                  )}
                </Menu.Item>
              </div>
            ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export default TokenDropdown;
