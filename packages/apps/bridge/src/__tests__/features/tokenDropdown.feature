Feature: Token Dropdown

Scenario: Selecting an active/enabled token
    Given I am on either transfer or release modules
    And have the default token, renBTC selected
    When I click on the token Dropdown
    And select an active token, like ETH
    Then it should not let me select it

Scenario: Selecting a inactive/disabled token
    Given I am on either transfer or release modules
    And have the default token, renBTC selected
    When I click on the token Dropdown
    And select a disabled token, like ibBTC
    Then it should not let me select it