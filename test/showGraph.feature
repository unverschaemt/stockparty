Feature: Show Graph
  As an admin
  I want to show the price graph.

  Scenario: show graph
    Given I have drinks in the system
    When I want to show a graph
    Then a new connection to graph has been established

  Scenario: show a second graph
    Given I have drinks in the system
    And a graph is already shown
    When I want to show a second graph
    Then there should be two connections to graphs

  Scenario: show graph without drinks
    Given I have no drinks in the system
    When I want to show a graph
    Then the user should get a notification, that there are no drinks in the database
