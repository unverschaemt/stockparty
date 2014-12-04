//var config = require('../config.js');
//var configfunctions = require('../configfunctions.js');
var drinkInterface = require('../../DrinkInterface.js');

var m = module.exports = {};


m.use = function (socket) {
    socket.on('adddrink', function (data, fn) {
        if (!(data && fn)) return console.error("Invalid input parameters in adminpanel/adddrink!");
        console.log('adddrink', data);
        drinkInterface.addDrink(data, fn);
    });
    socket.on('removedrink', function (data, fn) {
        if (!(data && fn)) return console.error("Invalid input parameters in adminpanel/removedrink!");
        console.log('remove drink', data);
        drinkInterface.removeDrink(data.drinkID, fn);
    });
    socket.on('setdrink', function (data, fn) {
        if (!(data && fn)) return console.error("Invalid input parameters in adminpanel/setdrink!");
        drinkInterface.setDrink(data, fn);
    });
    socket.on('setprice', function (data) {
        if (!(data)) return console.error("Invalid input parameter in adminpanel/setprice!");
        drinkInterface.setPrice(data);
    });
}
