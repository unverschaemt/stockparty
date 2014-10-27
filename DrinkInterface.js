var priceHistoryInterface = require('./database/PriceHistoryInterface');
var drinkInterface = require('./database/DrinkInterface');
var consumptionInterface = require('./database/ConsumptionInterface');
var priceCalculator = require('./PriceCalculator');

var m = module.exports = {};

m.getPriceEntry = function () {
    priceHistoryInterface.getLatestEntry(function error(err){console.log(err)}, function cb(obj){
        return obj;
    })
};

m.buyDrinks = function (priceID, guestID, drinks) {
    var time = new Date().getTime();
    for(var i in drinks){
        consumptionInterface.addConsumption(guestID, priceID, drinks[i].drinkID, drinks[i].quantity, time, function cb(){});
    }
};

m.addDrink = function (drink) {
    drinkDatabaseInterface.addDrink(drink.name, drink.priceMin, drink.priceMax, function cb(){});
};

m.removeDrink = function (drinkID) {
    drinkDatabaseInterface.removeDrink(drinkID);
};

m.setPrice = function (drinkID, price) {
    priceCalculator.setPrice(drinkID, price);
};

m.setDrink = function (drinkID, data) {
    drinkDatabaseInterface.setDrinkInfo(drinkID, data, function error(err){console.log(err)}, function cb(obj){console.log(obj)});
};

m.triggerStockCrash = function (decision) {
    priceCalculator.triggerStockCrash(decision);
};