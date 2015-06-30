Feature: Loading Of Cards
  As a cashier
  I want to load a card.

  Scenario: load a card
    Given I have a guest in the system
    When I load the card of the guest with a positive value
    Then the balance of the guest should be the old balance plus the added value

  Scenario: load card with negative value
    Given I have a guest in the system
    When I load the card of the guest with a negative value
    Then the user should get a notification, that it is not possible to add a negative value
	And the balance of the guest should be the old balance

  Scenario: add drink with missing information
    Given I have drinks in the system
    When I add a drink, with name missing
    Then the user should get a notification, that the name is missing
    And the focus in the table should be in the missing field