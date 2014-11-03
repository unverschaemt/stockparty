Feature: Pay Drinks
  As a cashier
  I want to order drinks for a guest
  and the order should be saved to database
    
  Scenario: when RFID card is recognized, the cashpanel should pop up
    Given I have drinks in the system
    And The user with the RFID Card is in the system
    And an RFID device is connected to the cashpanel
    When RFID Card is recognized
    Then the cashpanel should be enabled
    And a new pricefix is send to the cashpanel
    And the guest information are send to the cashpanel
    
  Scenario: order is saved to database
    Given I have drinks in the system
    And a cashier has selected the desired drinks
    And the guest has enough balance to pay the drinks
    When the cashier presses the button to create the order
    Then a new order should be saved in the consumption database
    And the cashpanel is cleared
    And the cashpanel is disabled
    
  Scenario: guest has not enough balance
    Given I have drinks in the system
    And a cashier has selected the desired drinks
    And the guest has not enough balance to pay the drinks
    When the cashier presses the button to create the order
    Then an error message is send to the cashpanel