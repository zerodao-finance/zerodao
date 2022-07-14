import { useState, useEffect } from "react";

export const ProgressDots = ({ max, current }) => {
  var rows = [];
  for (var i = 1; i <= max; i++) {
    rows.push(<Dot number={i} key={i} current={current} />);
  }
  return (
    <div className="flex flex-row gap-3 md:gap-4 self-center mt-3">{rows}</div>
  );
};

const Dot = ({ number, current }) => {
  const [props, setProps] = useState(
    "h-[10px] w-[10px] bg-gray-400 rounded-full"
  );
  useEffect(() => {
    if (number < current) {
      setProps("h-[10px w-[10px] bg-main-green rounded-full animate-pulse");
    } else if (number === current) {
      setProps("h-[10px] w-[10px] opacity-75 rounded-full animate-ping");
    } else {
      setProps("h-[10px] w-[10px] bg-gray-400 rounded-full");
    }
  }, [current]);

  return (
    <>
      <div className={props}></div>
    </>
  );
};
