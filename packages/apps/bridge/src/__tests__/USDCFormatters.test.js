import {
  formatUSDCPricedBTC,
  formatUSDCPricedETH,
  formatUSDC,
} from "../api/utils/formatters";
import { ethers } from "ethers";

describe("formatUSDCPricedBTC function", () => {
  let btc_usd = ethers.utils.parseUnits("30000", 6);
  let amount = "1.00000";

  test("it should return $0 for any empty string values", () => {
    expect(formatUSDCPricedBTC("", "")).toEqual("$0.00");
    expect(formatUSDCPricedBTC("", btc_usd)).toEqual("$0.00");
    expect(formatUSDCPricedBTC(amount, "")).toEqual("$0.00");
  });

  test("it should return proper amount for non-null values", () => {
    expect(formatUSDCPricedBTC(amount, btc_usd)).toEqual("$30,000.00");
  });
});

describe("formatUSDCPricedETH function", () => {
  let eth_usd = ethers.utils.parseUnits("3000", 6);
  let amount = "1.00000";

  test("it should return $0 for any empty string values", () => {
    expect(formatUSDCPricedETH("", "")).toEqual("$0.00");
    expect(formatUSDCPricedETH("", eth_usd)).toEqual("$0.00");
    expect(formatUSDCPricedETH(amount, "")).toEqual("$0.00");
  });

  test("it should return proper amount for non-null values", () => {
    expect(formatUSDCPricedETH(amount, eth_usd)).toEqual("$3,000.00");
  });
});

describe("formatUSDC function", () => {
  let amount = "100.5095";

  test("it should return $0 for any empty string values", () => {
    expect(formatUSDC("")).toEqual("$0.00");
  });

  test("it should return proper amount for non-null values", () => {
    expect(formatUSDC(amount)).toEqual("$100.51");
  });
});
