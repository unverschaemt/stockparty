Feature: Add drink
  As an admin
  I want to add a drink.

  Scenario: add new drink
    Given I have drinks in the system
    When I add a drink, which is not in database
    Then drink has been added to database
    And drink is available in cashpanel

  Scenario: add existing drink
    Given I have drinks in the system
    When I add a drink, which is already in database
    Then the user should get a notification, that the drink is already in database
    
  Scenario: add drink with missing information
    Given I have drinks in the system
    When I add a drink, with name missing
    Then the user should get a notification, that the name is missing
    And the focus in the table should be in the missing field