import React from "react";
import { render } from "@testing-library/react";
import { DefaultInput, PrimaryRoundedButton } from "../ui/atoms";
import NavigationBridgeToggle from "../ui/molecules/navigation/navigation.bridge.toggle";
import { Router } from "react-router-dom";
// import TokenDropdown from "../ui/atoms/dropdowns/dropdown.tokens";

export const useMockComponents = () => {
  // Input Mocked Component
  const inputUtils = render(<DefaultInput />);
  const input = inputUtils.getByTestId("default-input");

  const btcInputUtils = render(
    <DefaultInput dataTestId="btc-input" type="text" />
  );
  const btcInput = btcInputUtils.getByTestId("btc-input");

  // Navigation Mocked Components
  const navigationLink = (path) => {
    const wrapper = render(
      <button
        onClick={() => window.history.pushState({}, "", path)}
        data-testid="temp-nav"
      />
    );
    const link = wrapper.getByTestId("temp-nav");
    return link;
  };

  // Token Dropdown Component
  // const tokenDropdownUtils = render(<TokenDropdown tokensDisabled={["ibBTC"]} />);
  // const tokenDropdown = tokenDropdownUtils.getByTestId("token-dropdown");

  return {
    input,
    ...inputUtils,
    btcInput,
    ...btcInputUtils,
    navigationLink,
    // tokenDropdown,
    // ...tokenDropdownUtils
  };
};
