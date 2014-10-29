var config = require('../config.js');
var configfunctions = require('../configfunctions.js');
var drinkInterface = require('../../DrinkInterface.js');
var m = module.exports = {};

m.use = function (socket) {
    // Methods
    socket.drinkUpdate = function () {
        drinkInterface.getAllDrinks(function (err) {
            console.error('ERROR: Failed to load drinks!');
        }, function (drinks) {
            socket.emit('drinkupdate', {
                'drinks': drinks
            });
        });
    };
    // Initial Data Push
    socket.drinkUpdate();
}
