import fixtures from "zero-protocol/lib/fixtures";
import { selectFixture, tokenMapping } from "../api/utils/tokenMapping";

describe("selectFixture function", () => {
  test("it should return fixtures.ARBITRUM for 42161", () => {
    expect(selectFixture("42161")).toEqual(fixtures.ARBITRUM);
  });

  test("it should return fixtures.AVALANCHE for 43114", () => {
    expect(selectFixture("43114")).toEqual(fixtures.AVALANCHE);
  });

  test("it should return fixtures.MATIC for 137", () => {
    expect(selectFixture("137")).toEqual(fixtures.MATIC);
  });

  test("it should return fixtures.ETHEREUM for 1", () => {
    expect(selectFixture("1")).toEqual(fixtures.ETHEREUM);
  });

  test("it should return fixtures.ETHEREUM for null", () => {
    expect(selectFixture(null)).toEqual(fixtures.ETHEREUM);
  });
});

describe("tokenMapping function", () => {
  let tokenName = "USDC";
  let chainId = "42161";

  test("it should return fixtures.ARBITRUM.USDC for 42161 and USDC or usdc", () => {
    expect(tokenMapping({ tokenName, chainId })).toEqual(
      fixtures.ARBITRUM.USDC
    );
    tokenName = "usdc";
    expect(tokenMapping({ tokenName, chainId })).toEqual(
      fixtures.ARBITRUM.USDC
    );
  });

  test("it should return fixtures.ARBITRUM.ibBTC for 42161 and IBBTC or ibbtc", () => {
    tokenName = "IbBTC";
    expect(tokenMapping({ tokenName, chainId })).toEqual(
      fixtures.ARBITRUM.ibBTC
    );
    tokenName = "ibbtc";
    expect(tokenMapping({ tokenName, chainId })).toEqual(
      fixtures.ARBITRUM.ibBTC
    );
  });

  test("it should return fixtures.ARBITRUM.WBTC for 42161 and WBTC or wbtc", () => {
    tokenName = "WBTC";
    expect(tokenMapping({ tokenName, chainId })).toEqual(
      fixtures.ARBITRUM.WBTC
    );
    tokenName = "wbtc";
    expect(tokenMapping({ tokenName, chainId })).toEqual(
      fixtures.ARBITRUM.WBTC
    );
  });

  test("it should return fixtures.ARBITRUM.renBTC for 42161 and RENBTC or renbtc", () => {
    tokenName = "RENBTC";
    expect(tokenMapping({ tokenName, chainId })).toEqual(
      fixtures.ARBITRUM.renBTC
    );
    tokenName = "renbtc";
    expect(tokenMapping({ tokenName, chainId })).toEqual(
      fixtures.ARBITRUM.renBTC
    );
  });

  test("it should return fixtures.ETHEREUM.USDC for 1 and USDC or usdc", () => {
    chainId = "1";
    tokenName = "USDC";
    expect(tokenMapping({ tokenName, chainId })).toEqual(
      fixtures.ETHEREUM.USDC
    );
    tokenName = "usdc";
    expect(tokenMapping({ tokenName, chainId })).toEqual(
      fixtures.ETHEREUM.USDC
    );
  });

  test("it should return fixtures.ETHEREUM.ibBTC for 1 and IBBTC or ibbtc", () => {
    tokenName = "IbBTC";
    expect(tokenMapping({ tokenName, chainId })).toEqual(
      fixtures.ETHEREUM.ibBTC
    );
    tokenName = "ibbtc";
    expect(tokenMapping({ tokenName, chainId })).toEqual(
      fixtures.ETHEREUM.ibBTC
    );
  });

  test("it should return fixtures.ETHEREUM.WBTC for 1 and WBTC or wbtc", () => {
    tokenName = "WBTC";
    expect(tokenMapping({ tokenName, chainId })).toEqual(
      fixtures.ETHEREUM.WBTC
    );
    tokenName = "wbtc";
    expect(tokenMapping({ tokenName, chainId })).toEqual(
      fixtures.ETHEREUM.WBTC
    );
  });

  test("it should return fixtures.ETHEREUM.renBTC for 1 and RENBTC or renbtc", () => {
    tokenName = "RENBTC";
    expect(tokenMapping({ tokenName, chainId })).toEqual(
      fixtures.ETHEREUM.renBTC
    );
    tokenName = "renbtc";
    expect(tokenMapping({ tokenName, chainId })).toEqual(
      fixtures.ETHEREUM.renBTC
    );
  });
});
