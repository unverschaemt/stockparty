var mongoose = require('mongoose');
var alcoholInterface = require('./database/AlcoholLevelInterface');
var config = require('./config.json');

// Create db connection
var db = mongoose.connect(config.global.db);

timeOut = setInterval(function loop() {
  var alcoholEntries = Math.round(Math.random() * 5);
  for (var i = 0; i <= alcoholEntries; i++) {
    alcoholInterface.addAlcoholLevel(new Date().getTime(), Math.random() * 2, "F03DA23B22", function(obj) {});
  }
}, config.global.interval * 1000);
