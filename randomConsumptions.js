var mongoose = require('mongoose');
var drinkInterface = require('./database/DrinkInterface');
var consumptionInterface = require('./database/ConsumptionInterface');
var config = require('./config.json');

// Create db connection
var db = mongoose.connect(config.global.db);

timeOut = setInterval(function loop() {
  drinkInterface.getAllDrinks(function(err) {
    console.error(err)
  }, function(drinks) {
    for (var i in drinks) {
      consumptionInterface.addConsumption("F03DA23B22", 201410222053, i, Math.round(Math.random() * 10), new Date().getTime(), function(obj) {});
    }
  });
}, config.global.interval * 1000);
