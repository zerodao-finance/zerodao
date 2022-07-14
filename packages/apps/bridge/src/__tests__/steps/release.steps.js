import React from "react";
import { defineFeature, loadFeature } from "jest-cucumber";
import { fireEvent, render } from "@testing-library/react";
import { useMockComponents } from "../mockComponents";
import { PrimaryRoundedButton } from "../../ui/atoms";

const feature = loadFeature("src/__tests__/features/release.feature");

defineFeature(feature, (test) => {
  const { input, btcInput } = useMockComponents();

  beforeEach(() => {
    window.history.pushState({}, "Release", "/#/release");
    fireEvent.change(input, { target: { value: 0 } });
  });

  test("Releasing a negative amount", ({ given, when, then }) => {
    given("I am on the bridge release module", () => {
      expect(window.location.hash).toContain("release");
    });

    when("I enter a negative amount into the input", () => {
      fireEvent.change(input, { target: { value: "-1" } });
      expect(input.value).toBe("-1");
    });

    then("I cannot release the funds", () => {
      // Button Submit Mocked Component
      const buttonUtils = render(
        <PrimaryRoundedButton active={parseFloat(input.value) >= 0} />
      );
      const button = buttonUtils.getByTestId("rounded-button");
      expect(button.disabled).toBe(true);
    });
  });

  test("Releasing a small amount less than $30", ({ given, when, then }) => {
    given("I am on the bridge release module", () => {
      expect(window.location.hash).toContain("release");
    });

    when(
      /^I enter a small amount that results to less than \$(\d+)$/,
      (arg0) => {
        fireEvent.change(input, { target: { value: "0.001" } });
        expect(input.value).toBe("0.001");
      }
    );

    then("I am warned by the bridge that I could lose my funds", () => {
      // TODO: mock release hook and watch for notification to get triggered
    });
  });

  test("Releasing a large amount over $100K", ({ given, when, then }) => {
    given("I am on the bridge release module", () => {
      expect(window.location.hash).toContain("release");
    });

    when(/^I enter an amount that results to over \$(\d+)K$/, (arg0) => {
      fireEvent.change(input, { target: { value: "5" } });
      expect(input.value).toBe("5");
    });

    then("I am warned by the bridge that I could lose my funds", () => {
      // TODO: mock release hook and watch for notification to get triggered
    });
  });

  test("Releasing an an amount more than $30 and less than $100K", ({
    given,
    when,
    and,
    then,
  }) => {
    given("I am on the bridge release module", () => {
      expect(window.location.hash).toContain("release");
    });

    when(
      /^I enter an amount resulting between \$(\d+) and \$(\d+)K$/,
      (arg0, arg1) => {
        fireEvent.change(input, { target: { value: "1" } });
        expect(input.value).toBe("1");
      }
    );

    and("I enter my recieving bitcoin address", () => {
      // BTC Random Address
      fireEvent.change(btcInput, {
        target: { value: "19BY2XCgbDe6WtTVbTyzM9eR3LYr6VitWK" },
      });
      expect(btcInput.value).toBe("19BY2XCgbDe6WtTVbTyzM9eR3LYr6VitWK");
    });

    then("I am able to release my funds to the bitcoin chain", () => {
      // Button Submit Mocked Component
      const buttonUtils = render(
        <PrimaryRoundedButton active={parseFloat(input.value) >= 0} />
      );
      const button = buttonUtils.getByTestId("rounded-button");

      expect(button.disabled).toBe(false);
    });

    and("I am shown the fees for executing the transaction", () => {
      expect(parseFloat(input.value)).toBeGreaterThan(0);
    });

    and("I am shown the amount I will receive after fees", () => {
      // TODO
    });
  });
});
