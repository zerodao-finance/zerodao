import { defineFeature, loadFeature } from "jest-cucumber";
// import { useMockComponents } from "../mockComponents";

const feature = loadFeature("src/__tests__/features/tokenDropdown.feature");

defineFeature(feature, (test) => {
  // const { tokenDropdown } = useMockComponents();

  beforeEach(() => {
    window.history.pushState({}, "Transfer", "/#/transfer");
  });

  test("Selecting an active/enabled token", ({ given, and, when, then }) => {
    given("I am on either transfer or release modules", () => {
      expect(window.location.hash).toContain("transfer");
    });

    and("have the default token, renBTC selected", () => {
      // TODO: Get a transformer for SVG's before using tokenDropdown
    });

    when("I click on the token Dropdown", () => {});

    and("select an active token, like ETH", () => {});

    then("it should not let me select it", () => {});
  });

  test("Selecting a inactive/disabled token", ({ given, and, when, then }) => {
    given("I am on either transfer or release modules", () => {
      expect(window.location.hash).toContain("transfer");
    });

    and("have the default token, renBTC selected", () => {});

    when("I click on the token Dropdown", () => {});

    and("select a disabled token, like ibBTC", () => {});

    then("it should not let me select it", () => {});
  });
});
