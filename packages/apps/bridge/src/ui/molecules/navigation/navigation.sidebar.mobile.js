/* This example requires Tailwind CSS v2.0+ */
import { RiFileListLine, RiExchangeFundsLine } from "react-icons/ri";
import { MdOutlinePending } from "react-icons/md";
import { BiTransfer } from "react-icons/bi";
import { Link } from "react-router-dom";

export function MobileNavigationSidebar({ changeModule }) {
  return (
    <nav aria-label="Sidebar">
      <Link to="/transfer">
        <div
          className="flex flex-row gap-3 py-3"
          id="bridge"
          onClick={(e) => changeModule(e.currentTarget.id)}
        >
          <RiExchangeFundsLine className="h-[1.2rem] w-[1.2rem]" />
          <button id="bridge">Bridge Tool</button>
        </div>
      </Link>
      <Link to="/manage">
        <div
          className="flex flex-row gap-3 py-3"
          id="manage"
          onClick={(e) => changeModule(e.currentTarget.id)}
        >
          <MdOutlinePending className="h-[1.2rem] w-[1.2rem]" />
          <button id="manage">Manage Transactions</button>
        </div>
      </Link>
      <Link to="/history">
        <div
          className="flex flex-row gap-3 py-3"
          id="history"
          onClick={(e) => changeModule(e.currentTarget.id)}
        >
          <BiTransfer className="h-[1.2rem] w-[1.2rem]" />

          <button id="history">History</button>
        </div>
      </Link>
      <div className="flex flex-row gap-3 py-3">
        <RiFileListLine className="h-[1.2rem] w-[1.2rem]" />
        <a href="https://docs.zerodao.com" target="_blank" rel="noreferrer">
          <button>Documentation</button>
        </a>
      </div>
    </nav>
  );
}
