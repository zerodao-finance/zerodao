import { useState } from "react";
import QrReader from "react-qr-scanner";

function CameraScan({ onScan }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleScan = (data) => {
    if (data) {
      const address = data.text.includes(":")
        ? data.text.split(":")[1]
        : data.text;
      const e = { target: { value: address } };
      onScan(e);

      if (data.text !== "") {
        setIsOpen(false);
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
    alert("Error scanning QR code. Please type it in instead.");
  };

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="flex items-center grayscale invert cursor-pointer"
      >
        <img src="/qr-code.png" alt="qr code" height="40" width="40" />
      </div>
      {isOpen && (
        <div className="absolute left-0 -top-4 md:-top-8 w-full animate-fade-in">
          <QrReader
            delay={200}
            onError={handleError}
            onScan={handleScan}
            legacyMode={true}
            style={{
              borderTopRightRadius: "10px",
              borderTopLeftRadius: "10px",
            }}
          />
          <div
            style={{
              borderBottomRightRadius: "10px",
              borderBottomLeftRadius: "10px",
            }}
            className="text-center py-2 bg-badger-black-700 cursor-pointer hover:text-main-green transition duration-200"
            onClick={() => setIsOpen(false)}
          >
            <span>Close</span>
          </div>
        </div>
      )}
    </>
  );
}

export default CameraScan;
