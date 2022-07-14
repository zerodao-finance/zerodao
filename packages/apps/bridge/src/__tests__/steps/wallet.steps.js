import { defineFeature, loadFeature } from "jest-cucumber";
import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { generateTestingUtils } from "eth-testing";

const feature = loadFeature("src/__tests__/features/wallet.feature");

defineFeature(feature, (test) => {
  const testingUtils = generateTestingUtils({ providerType: "MetaMask" });

  const connect = () => {
    testingUtils.mockConnectedWallet([
      "0xf61B443A155b07D2b2cAeA2d99715dC84E839EEf",
    ]);
  };

  beforeAll(() => {
    // Manually inject the mocked provider in the window as MetaMask does
    global.window.ethereum = testingUtils.getProvider();
  });

  afterEach(() => {
    // Clear all mocks between tests
    testingUtils.clearAllMocks();
  });

  test("Connecting your wallet", ({ given, and, when, then }) => {
    given(
      "I have never used the bridge but have acknowledged the disclaimer",
      () => {
        // Start with not connected wallet
        testingUtils.mockNotConnectedWallet();
        // Mock the connection request of MetaMask
        testingUtils.mockRequestAccounts([
          "0xf61B443A155b07D2b2cAeA2d99715dC84E839EEf",
        ]);

        // TODO: Mock a button click on NavigationTopBar - error "TextEncoder" is not defined
      }
    );

    and("I see the connecting wallet loading screen", () => {});

    when("I select my wallet provider", () => {});

    then(
      "my account connects to the bridge app if on Ethereum Chain",
      () => {}
    );
  });
});
