Feature: Wallet Connect

Scenario: Connecting your wallet
    Given I have never used the bridge but have acknowledged the disclaimer
    And I see the connecting wallet loading screen
    When I select my wallet provider
    Then my account connects to the bridge app if on Ethereum Chain