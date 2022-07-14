Feature: Navigation

Scenario: Viewing the bridge release module by clicking
    Given I am on the default home screen - bridge transfer module
    When I click on the release tab
    Then I should be able to view the bridge release module

Scenario: Viewing the bridge transfer module by clicking
    Given I am on the bridge release module
    When I click on the transfer tab
    Then I should be able to view the bridge transfer module

Scenario: Viewing the bridge modules by url
    Given I am on the default home screen - bridge transfer module
    When I enter the url followed by /#/release 
    Then I should be able to view the bridge release module

Scenario: Viewing transaction history
    Given I am on the default home screen - bridge transfer module
    When I click on "Transaction History" in the sidebar
    Then I should see previous transaction if I have any

Scenario: Viewing transaction manager
    Given I am on the default home screen - bridge transfer module
    When I click on "Manage Transactions" in the sidebar
    Then I should see pending and previous transactions if I have any 
