import { BsArrowRightShort } from "react-icons/bs";
export const TransferCardTitle = () => {
  return (
    <>
      <div className="text-black dark:text-badger-white-400 text-[13px]">
        <div className="grid grid-cols-2 grid-flow-rows max-w-fit text-xs md:tracking-wider md:text-xs border-b-[1px]">
          <p>Date:</p>
          <p className="text-black dark:text-main-green" id="date">
            11/11/1111
          </p>
          <p>Time:</p>
          <p className="text-black dark:text-main-green" id="time">
            11:11
          </p>
        </div>
        <div className="flex flex-row gap-2 items-center text-xs my-1 md:tracking-wider md:text-[14px]">
          <p className="text-main-green">0.321 BTC</p>
          <BsArrowRightShort />
          <p>0x4323...1232</p>
        </div>
      </div>
    </>
  );
};
