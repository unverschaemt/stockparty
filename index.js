var mongoose = require('mongoose');
var databaseInterface = require('./database/UserInterface');


// Create db connection
var db = mongoose.connect("mongodb://localhost/stockparty");

databaseInterface.addUser("Kkoile", "123", "Nils", {"Barkeeper":123});