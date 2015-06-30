Feature: Manage Hardware Interfaces
  As an admin
  I want to connect a hardware interface to a client.

  Scenario: connect hardware interface to a client
    Given I have an RFID reader connected to the system
	And I have a client in the system
    When I connect the RFID reader to the client
    Then there should be a connection between those
    And client listens to interrupts of RFID reader

  Scenario: connect a second hardware interface to a client
    Given I have two RFID reader connected to the system
	And I have a client in the system
	And I have an RFID reader connected to a client
    When I connect the second RFID reader to the client
    Then the user should get a notification, that it is not possible

	
	