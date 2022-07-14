import { RiFileListLine, RiExchangeFundsLine } from "react-icons/ri";
import { MdOutlinePending } from "react-icons/md";
import { BiTransfer } from "react-icons/bi";
import { Link } from "react-router-dom";

export const DefaultNavigationSidebar = ({ changeModule }) => {
  return (
    <div className="min-h-full hidden md:block flex fixed right-0 w-20 hover:w-[14rem] group rounded-l-[2rem] shadow-2xl z-50 bg-gradient-to-b from-zero-green-500 to-zero-green-800 transition-all ease-in-out duration-150 text-badger-white-400 font-bold">
      <div className="grow w-full flex flex-col items-center justify-between pb-40 mt-[8rem]">
        <div className="flex flex-col gap-4 w-full">
          <Link to="/transfer">
            <div
              className={
                "flex flex-row gap-1 w-full py-4 hover:underline decoration-2 decoration-main-green dark:decoration-white  cursor-pointer hover:bg-black/10 transition ease-in-out duration-150 "
              }
              id="bridge"
              onClick={(e) => changeModule(e.currentTarget.id)}
            >
              <div className="flex flex-row mx-auto">
                <RiExchangeFundsLine className="h-[1.2rem] w-[1.2rem]" />
                <div
                  className="hidden group-hover:block opacity-0 group-hover:opacity-100 pl-3"
                  id="bridge"
                >
                  Bridge Tool
                </div>
              </div>
            </div>
          </Link>
          <Link to="/manage">
            <div
              className={
                "flex flex-row gap-3 w-full py-4 hover:underline decoration-2 decoration-white  cursor-pointer hover:bg-black/10 transition ease-in-out duration-150 "
              }
              id="manage"
              onClick={(e) => changeModule(e.currentTarget.id)}
            >
              <div className="flex flex-row mx-auto">
                <MdOutlinePending className="h-[1.2rem] w-[1.2rem]" />
                <div
                  className="hidden group-hover:block opacity-0 group-hover:opacity-100 pl-3"
                  id="manage"
                >
                  Manage Transactions
                </div>
              </div>
            </div>
          </Link>
          <Link to="/history">
            <div
              className={
                "flex flex-row gap-3 w-full py-4 hover:underline decoration-2 decoration-white  cursor-pointer hover:bg-black/10 transition ease-in-out duration-150 "
              }
              id="history"
              onClick={(e) => changeModule(e.currentTarget.id)}
            >
              <div className="flex flex-row mx-auto">
                <BiTransfer className="h-[1.2rem] w-[1.2rem]" />
                <div
                  className="hidden group-hover:block opacity-0 group-hover:opacity-100 pl-3"
                  id="history"
                >
                  History
                </div>
              </div>
            </div>
          </Link>
          <div
            className="flex flex-row gap-3 w-full py-4 hover:underline decoration-2 decoration-white cursor-pointer hover:bg-black/10 transition ease-in-out duration-150"
            onClick={() => window.open("https://docs.zerodao.com")}
          >
            <div className="flex flex-row mx-auto">
              <RiFileListLine className="h-[1.2rem] w-[1.2rem]" />
              <div className="hidden group-hover:block opacity-0 group-hover:opacity-100 pl-3">
                Documentation
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
