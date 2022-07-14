import { BiLoaderCircle } from "react-icons/bi";
export const LoadingIndicator = ({ title }) => {
  return (
    <div className="flex flex-col justify-center items-center gap-5 mx-4 my-7 min-h-[290px]">
      <p className="text-emerald-700 dark:text-gray-200 capitalize text-light text-[17px] tracking-wider mx-3 animate-pulse">
        {title}
      </p>
      <div className="animate-[spin_5s_linear_infinite] animate-ping">
        <BiLoaderCircle className="fill-emerald-600 text-[30px] animate-pulse animate-ping" />
      </div>
    </div>
  );
};
