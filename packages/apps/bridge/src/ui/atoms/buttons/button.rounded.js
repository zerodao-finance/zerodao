import * as React from "react"; // Needs to be here for testing

export const PrimaryRoundedButton = ({ active, label, action }) => {
  const getClass = () => {
    if (active) {
      return "transition ease-in-out duration-150 px-2 py-1 hover:bg-zero-green-500/40 bg-zero-green-500/90 font-medium rounded-lg text-badger-white-400 w-full truncate text-sm md:text-base";
    }
    return "cursor-not-allowed transition ease-in-out duration-150 px-2 py-1 font-medium w-full rounded-lg bg-badger-gray-400 text-badger-gray-200 truncate text-sm md:text-base";
  };
  return (
    <>
      <button
        data-testid="rounded-button"
        onClick={
          active
            ? action
            : () => {
                return;
              }
        }
        className={getClass()}
        disabled={!active}
      >
        {label}
      </button>
    </>
  );
};
