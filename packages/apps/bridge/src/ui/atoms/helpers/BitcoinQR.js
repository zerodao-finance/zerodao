import React, { useEffect, useState } from "react";
import QRCode from "qrcode";

export const BitcoinQR = ({ bitcoinAddress, amount }) => {
  const [qrImg, setQrImg] = useState(null);
  useEffect(() => {
    QRCode.toDataURL(`bitcoin:${bitcoinAddress}?amount=${amount}`)
      .then((url) => {
        setQrImg(url);
      })
      .catch((err) => {
        console.error(err);
      });
  });
  return <img src={qrImg} />;
};
