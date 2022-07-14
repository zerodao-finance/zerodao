import { ReactComponent as Warning } from "../../../assets/svg-common/warning.svg";

function UnderConstruction({
  size = "10rem",
  color = "#fff",
  padding = "3rem",
  text = "This page is under construction.",
}) {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          fill: color,
          padding: padding,
        }}
      >
        <Warning
          style={{
            width: size,
            height: size,
          }}
        />
      </div>
      {text && <p className="text-badger-white-400 text-center">{text}</p>}
    </>
  );
}

export default UnderConstruction;
