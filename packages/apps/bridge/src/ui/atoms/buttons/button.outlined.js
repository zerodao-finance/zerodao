export const PrimaryOutlinedButton = ({ label, action }) => {
  return (
    <>
      <button
        onClick={action}
        className="px-2 py-1 hover:bg-hover-green font-bold rounded-md bg-main-green max-w-[160px] truncate text-[13px] md:text-[15px]"
      >
        {label}
      </button>
    </>
  );
};
