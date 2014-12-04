Feature: Stockcrash
  As a user
  I want to choose a client after successful connection and login

  Scenario: load client list
    Given Connection established
    When Successful login
    Then Load the client list
    And Show the client list

  Scenario: choose Client
    Given Connection established
    And Successful login
    And List loaded
    And List is shown
    When I choose a client from the list
    Then Choice needs to be sent to server
    And According client UI gets loaded

