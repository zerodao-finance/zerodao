Feature: Release

Scenario: Releasing a negative amount
    Given I am on the bridge release module
    When I enter a negative amount into the input
    Then I cannot release the funds

Scenario: Releasing a small amount less than $30
    Given I am on the bridge release module
    When I enter a small amount that results to less than $30
    Then I am warned by the bridge that I could lose my funds

Scenario: Releasing a large amount over $100K
    Given I am on the bridge release module
    When I enter an amount that results to over $100K
    Then I am warned by the bridge that I could lose my funds

Scenario: Releasing an an amount more than $30 and less than $100K
    Given I am on the bridge release module
    When I enter an amount resulting between $30 and $100K
    And I enter my recieving bitcoin address
    Then I am able to release my funds to the bitcoin chain
    And I am shown the fees for executing the transaction
    And I am shown the amount I will receive after fees