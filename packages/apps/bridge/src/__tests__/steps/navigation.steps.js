import { fireEvent } from "@testing-library/react";
import { defineFeature, loadFeature } from "jest-cucumber";
import { useMockComponents } from "../mockComponents";

const feature = loadFeature("src/__tests__/features/navigation.feature");

defineFeature(feature, (test) => {
  const { navigationLink } = useMockComponents();

  test("Viewing the bridge release module by clicking", ({
    given,
    when,
    then,
  }) => {
    given("I am on the default home screen - bridge transfer module", () => {
      window.history.pushState({}, "Transfer", "/#/transfer");
      expect(window.location.hash).toContain("transfer");
    });

    when("I click on the release tab", () => {
      fireEvent.click(navigationLink("/#/release"));
    });

    then("I should be able to view the bridge release module", () => {
      expect(window.location.hash).toContain("release");
    });
  });

  test("Viewing the bridge transfer module by clicking", ({
    given,
    when,
    then,
  }) => {
    given("I am on the bridge release module", () => {
      window.history.pushState({}, "Release", "/#/release");
      expect(window.location.hash).toContain("release");
    });

    when("I click on the transfer tab", () => {
      fireEvent.click(navigationLink("/#/transfer"));
    });

    then("I should be able to view the bridge transfer module", () => {
      expect(window.location.hash).toContain("transfer");
    });
  });

  test("Viewing the bridge modules by url", ({ given, when, then }) => {
    given("I am on the default home screen - bridge transfer module", () => {
      window.history.pushState({}, "Transfer", "/#/transfer");
      expect(window.location.hash).toContain("transfer");
    });

    when("I enter the url followed by /#/release", () => {
      window.history.pushState({}, "Release", "/#/release");
    });

    then("I should be able to view the bridge release module", () => {
      expect(window.location.hash).toContain("release");
    });
  });

  test("Viewing transaction history", ({ given, when, then }) => {
    given("I am on the default home screen - bridge transfer module", () => {
      window.history.pushState({}, "Transfer", "/#/transfer");
      expect(window.location.hash).toContain("transfer");
    });

    when(/^I click on "(.*)" in the sidebar$/, (arg0) => {
      fireEvent.click(navigationLink("/#/history"));
      expect(window.location.hash).toContain("history");
    });

    then("I should see previous transaction if I have any", () => {
      // TODO: Mock hook to see previous transactions
    });
  });

  test("Viewing transaction manager", ({ given, when, then }) => {
    given("I am on the default home screen - bridge transfer module", () => {
      window.history.pushState({}, "Transfer", "/#/transfer");
      expect(window.location.hash).toContain("transfer");
    });

    when(/^I click on "(.*)" in the sidebar$/, (arg0) => {
      fireEvent.click(navigationLink("/#/manage"));
      expect(window.location.hash).toContain("manage");
    });

    then("I should see pending and previous transactions if I have any", () => {
      // TODO: Mock hook to see previous transactions
    });
  });
});
