export const ManageTransactionLayout = ({ children, title }) => {
  return (
    <div className="w-full">
      <div
        className={`w-full rounded-t-[8px] grid grid-cols-1 dark:bg-badger-gray-400 align-center font-light tracking-wider text-sm text-center`}
        style={{ maxHeight: "42px" }}
      >
        <div className="py-[10px] w-full rounded-tl-[8px] transition ease-in-out duration-150 text-black border-b-2 border-transparent dark:text-zero-neon-green-500 font-bold">
          {title}
        </div>
      </div>
      <div className="grid grid-cols-1 w-full md:grid-cols-2 rounded-b-[8px] bg-badger-black-500 gap-1 py-6 px-8 overflow-auto">
        {children}
      </div>
    </div>
  );
};
