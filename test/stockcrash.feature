Feature: Stockcrash
  As an admin
  I want to trigger a stockcrash. So all prices should be set to lowest or the calculation should start again.

  Scenario: enable Stockcrash
    Given I have drinks in the system
    And Calculation of drinks is running
    And Stockcrash is not enabled yet
    When I enable Stockcrash
    Then Calculation should pause
    And New PriceHistory entry with lowest prices should be created

  Scenario: disable Stockcrash
    Given I have drinks in the system
    And Stockcrash is enabled
    When I disable Stockcrash
    Then Calculation should start
    And New PriceHistory entry should be created

  Scenario: enable Stockcrash when Stockcrash is already enabled
    Given Stockcrash is enabled
    When I enable Stockcrash
    Then nothing should change

  Scenario: disable Stockcrash when Stockcrash is already disabled
    Given Stockcrash is disabled
    When I disable Stockcrash
    Then nothing should change