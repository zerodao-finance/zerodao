import { ethers } from "ethers";
import { getStatus } from "../../../api/transaction/status";
import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationIcon } from "@heroicons/react/outline";
import {
  reverseTokenMapping,
  txCardAmount,
} from "../../../api/utils/tokenMapping";
import { getChainName, getExplorerRoot } from "../../../api/utils/chains";

export function CardTypeSwitch({ data, key, type }) {
  switch (data.type) {
    case "burn":
      return <BurnManageCard data={data} key={key} type={type} />;
    case "transfer":
      return <ManageTransactionCard data={data} key={key} type={type} />;
    default:
      return;
  }
}

export const BurnManageCard = ({ data }) => {
  const [details, toggle] = useState(false);
  function truncateAddress(address) {
    try {
      const checksummedAddress = ethers.utils.getAddress(address);
      return (
        checksummedAddress.slice(0, 6) + "..." + checksummedAddress.slice(-4)
      );
    } catch (error) {
      return address.slice(0, 6) + "..." + address.slice(-4);
    }
  }

  if (!details)
    return (
      <div
        key={data.id}
        className="bg-badger-gray-500 rounded-md shadow-md text-xs max-w-[500px] px-4 py-1 grid gap-1"
      >
        {ParseDetails(data._data, "burn", truncateAddress)}
      </div>
    );
};

function ParseDetails(data, type, truncateAddress) {
  switch (type) {
    case "burn":
      if (!data || !data.underwriterRequest) break;
      if (data.underwriterRequest?.contractAddress) {
        return (
          <>
            <div className="grid grid-cols-2">
              <p className="text-badger-white-400 text-md justify-self-start font-semibold">
                {type} :
              </p>
              <p className="text-zero-neon-green-500 justify-self-end">
                {truncateAddress(
                  ethers.utils.getAddress(
                    data.underwriterRequest?.contractAddress
                  )
                )}
              </p>
            </div>
            <hr className="border-badger-black-800" />
            <div className="grid text-badger-white-400 grid-cols-2">
              <span className="justify-self-start"> to: </span>
              <a
                className="text-xs justify-self-end underline"
                href={
                  getExplorerRoot(String(data.underwriterRequest?.chainId)) +
                  ethers.utils.getAddress(data.hostTX.to)
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                {truncateAddress(data.hostTX.to)}
              </a>
              <span className="justify-self-start"> amount: </span>
              <span className="justify-self-end">
                {" "}
                {txCardAmount({
                  amount: data.underwriterRequest?.amount,
                  tokenName: data.underwriterRequest?.assetName,
                })}{" "}
              </span>
              <span className="justify-self-start"> asset: </span>
              <span className="justify-self-end">
                {" "}
                {data.underwriterRequest?.assetName}
              </span>
              <span className="justify-self-start"> chain: </span>
              <span className="justify-self-end">
                {" "}
                {getChainName(String(data.underwriterRequest?.chainId))}{" "}
              </span>
            </div>
          </>
        );
      }
      if (!data || !data.hostTX) return <></>;
      return (
        <>
          <div className="grid grid-cols-2">
            <p className="text-badger-white-400 text-md justify-self-start font-semibold">
              {type} :
            </p>
            <p className="text-zero-neon-green-500 justify-self-end">
              {truncateAddress(data.hostTX.transactionHash)}
            </p>
          </div>
          <hr className="border-badger-black-800" />
          <div className="grid text-badger-white-400 grid-cols-2">
            <span className="justify-self-start"> to: </span>
            <a className="text-xs justify-self-end underline">
              {truncateAddress(data.hostTX.to)}
            </a>
            <span className="justify-self-start"> view on Etherscan: </span>
            <a
              className="text-xs justify-self-end underline text-zero-neon-green-500"
              href={`https://etherscan.io/tx/${data.hostTX.transactionHash}`}
            >
              {truncateAddress(data.hostTX.transactionHash)}
            </a>
          </div>
        </>
      );
  }
}

export const ManageTransactionCard = ({ data }) => {
  if (!data || !data._data || !data._data.asset) return <></>;

  const [details, toggle] = useState(false);
  const tokenName = reverseTokenMapping({ tokenAddress: data._data.asset });

  function truncateAddress(address) {
    const checksummedAddress = ethers.utils.getAddress(address);
    return (
      checksummedAddress.slice(0, 6) + "..." + checksummedAddress.slice(-4)
    );
  }

  if (!details)
    return (
      <div
        key={data.id}
        className="bg-badger-gray-500 rounded-md shadow-md text-xs max-w-[300px] px-4 py-1 grid gap-1"
      >
        <div className="grid grid-cols-2">
          <p className="text-md text-badger-white-400 justify-self-start font-semibold">
            {data.type} :
          </p>
          <p className="text-zero-neon-green-500 justify-self-end">
            {truncateAddress(data._data.contractAddress)}
          </p>
        </div>
        <hr className="border-badger-black-800" />
        <div className="grid text-badger-white-400 grid-cols-2">
          <span className="justify-self-start"> to: </span>
          <a
            className="text-xs justify-self-end underline"
            href={
              getExplorerRoot(String(data._data.chainId)) +
              ethers.utils.getAddress(data._data.to)
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            {truncateAddress(data._data.to)}
          </a>
          <span className="justify-self-start"> amount: </span>
          <span className="justify-self-end">
            {" "}
            {txCardAmount({
              amount: data._data.amount,
              tokenName: tokenName,
            })}{" "}
          </span>
          <span className="justify-self-start"> asset: </span>
          <span className="justify-self-end"> {tokenName} </span>
          <span className="justify-self-start"> chain: </span>
          <span className="justify-self-end">
            {" "}
            {getChainName(String(data._data.chainId))}{" "}
          </span>
        </div>
        <div
          className="underline justify-self-center text-zero-neon-green-500 mt-px cursor-pointer"
          onClick={() => toggle(true)}
        >
          click for fallback mint details
        </div>
      </div>
    );

  return <Details data={data} toggle={toggle} />;
};

function Details({ data, toggle }) {
  const { passed } = getStatus(data);
  const [open, setOpen] = useState(false);

  return (
    <div
      className="bg-badger-gray-500 rounded-md shadow-md text-xs max-w-[300px] px-4 grid"
      key={data.id}
    >
      <div className="w-full flex justify-end h-4">
        <p
          className="block -top-1 -mr-1 text-lg text-orange-600 cursor-pointer"
          onClick={() => toggle(false)}
        >
          &times;
        </p>
      </div>
      {passed ? (
        <div className="grid h-full py-2 items-center content-center ">
          <div className="grid text-badger-white-400 grid-cols-2">
            <span className="justify-self-start"> target: </span>
            <span className="text-xs justify-self-end"> {passed.target} </span>
            <span className="justify-self-start"> current: </span>
            <span className="text-xs justify-self-end"> {passed.confs} </span>
          </div>
          <div
            onClick={() => {
              passed.fallbackMint ? setOpen(true) : () => {};
            }}
            className="underline justify-self-center text-zero-neon-green-500 mt-px cursor-pointer"
          >
            Fallback Mint
          </div>
          <FallbackWarning
            open={open}
            setOpen={setOpen}
            fallback={passed.fallbackMint}
          />
        </div>
      ) : (
        <div className="h-full flex items-center justify-center content-center animate-pulse text-badger-white-400 py-8">
          loading
        </div>
      )}
    </div>
  );
}

export default function FallbackWarning({ open, setOpen, fallback }) {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationIcon
                      className="h-6 w-6 text-red-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      Fallback Mint
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Use this feature if your funds have not arrived after
                        your deposit has reached more than 6 confirmations.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                      fallback();
                      setOpen(false);
                    }}
                  >
                    Fallback
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
