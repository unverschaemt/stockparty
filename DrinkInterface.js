var priceHistoryInterface = require('./database/PriceHistoryInterface');
var drinkDatabaseInterface = require('./database/DrinkInterface');
var consumptionInterface = require('./database/ConsumptionInterface');
var guestInterface = requre('./database/GuestInterface');
var balanceInterface = require('./database/BalanceInterface');
var priceCalculator = require('./PriceCalculator');

var m = module.exports = {};
var priceEntryCache = {};

m.getPriceEntry = function (callBack) {
    priceHistoryInterface.getLatestEntry(function error(err){console.log(err)}, function cb(obj){
        callBack(obj);
    })
};

m.buyDrinks = function (data, callBack) {
    var price = 0;
    var received = 0;
    for(var i in data.drinks){
        getPriceOfDrink(data.priceID, data.drinks[i].drinkID, function cb(obj){
            price += obj*data.drinks[i].quantity;
            received++;
            if(data.drinks.length == received){
                guestInterface.getBalanceOfGuest(data.guestID, function cb(obj){
                    if(price < obj){
                        addConsumption(data.drinks, data.guestID, data.priceID, callBack);
                    }else{
                        callBack(false);
                    }
                });
            }
        });
    }
};

m.getAllDrinks = function (error, cb){
    drinkDatabaseInterface.getAllDrinks(function err(err){error(err)}, cb);
};

m.addDrink = function (drink, cb) {
    drinkDatabaseInterface.addDrink(drink.name, drink.priceMin, drink.priceMax, cb);
};

m.removeDrink = function (drinkID, cb) {
    drinkDatabaseInterface.deleteDrink(drinkID, function err(){}, cb);
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

getPriceOfDrink = function (priceID, drinkID, callBack){
    //TODO: implement price entry cache, so you don't have to make a database request when several drinks are bought with the same priceID
    priceHistoryInterface.getPricesForID(priceID, function error(err){console.log(err)}, function cb(obj){
        for(var i in obj.drinks){
              if(obj.drinks[i].id == drinkID){
                callBack(obj.drinks[i].price);
              }
        }
        callBack(false);
    });
};

addConsumption = function(drinks, guestID, priceID, callBack){
    var saved = 0;
    var time = new Date().getTime();
    for(var i in drinks){
        consumptionInterface.addConsumption(guestID, priceID, drinks[i].drinkID, drinks[i].quantity, time, function cb(obj){
            saved++;
            if(drinks.length == saved){
                callBack(true);   
            }
        });
    }   
};