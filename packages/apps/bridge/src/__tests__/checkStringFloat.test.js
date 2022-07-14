import { isStringFloat } from "../ui/molecules/bridge.gateway/slippage.input.gateway";

describe("isStringFloat function", () => {
  test("it should return false for any letter", () => {
    expect(isStringFloat("a04.0")).toEqual(false);
  });

  test("it should return false for no decimal", () => {
    expect(isStringFloat("100")).toEqual(false);
  });

  test("it should return false for negative", () => {
    expect(isStringFloat("-100")).toEqual(false);
  });

  test("it should return true for float", () => {
    expect(isStringFloat("8.760")).toEqual(true);
  });
});
