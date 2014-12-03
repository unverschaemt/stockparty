Feature: Remove drink
  As an admin
  I want to remove a drink.

  Scenario: remove drink
    Given I have drinks in the system
    When I remove a drink
    Then drink has been deleted from database
    And drink isn't available in cashpanel anymore