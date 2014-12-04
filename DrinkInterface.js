var priceHistoryInterface = require('./database/PriceHistoryInterface');
var drinkDatabaseInterface = require('./database/DrinkInterface');
var consumptionInterface = require('./database/ConsumptionInterface');
var guestInterface = require('./database/GuestInterface');
var balanceInterface = require('./database/BalanceInterface');
var priceCalculator = require('./PriceCalculator');
var broadcasts = require('./connection/broadcasts.js');

var m = module.exports = {};
var priceEntryCache = {};

m.getPriceEntry = function (error, callBack) {
    priceHistoryInterface.getLatestEntry(error, function cb(entry) {
        drinkDatabaseInterface.getAllDrinks(error, function cb(drinks) {
            var entryObj = {};
            for (var i in entry.drinks) {
                entryObj[entry.drinks[i].drinkID] = entry.drinks[i];
            }
            for (var i in drinks) {
                if (!entryObj[drinks[i]._id]) {
                    entry.drinks.push({
                        'id': drinks[i]._id,
                        'price': (drinks[i].priceMax + drinks[i].priceMin) / 2
                    });
                }
            }
        });
        callBack(entry);
    })
};

m.buyDrinks = function (data, callBack) {
    var price = 0;
    var drinks = [];
    for (var i in data.drinks) {
        if (data.drinks[i].type == 'drink') {
            getPriceOfDrink(data.priceID, data.drinks[i].drinkID, function cb(obj) {
                price += obj * data.drinks[i].quantity;
                drinks.push(data.drinks[i]);
            });
        } else {
            balanceInterface.addBalance({
                'balance': data.drinks[i].balance,
                'guest': data.guestID
            }, callBack);
        }
    }

    guestInterface.getGuest(data.guestID, function error(err) {
        console.log(err)
    }, function cb(obj) {
        if (price < obj.balance) {
            addConsumption(drinks, data.guestID, data.priceID, callBack);
        } else {
            callBack(false);
        }
    });
};

m.getAllDrinks = function (error, cb) {
    drinkDatabaseInterface.getAllDrinks(function err(err) {
        error(err)
    }, cb);
};

m.addDrink = function (drink, cb) {
    drinkDatabaseInterface.addDrink(drink.name, drink.size, drink.priceMin, drink.priceMax, function callBack(obj) {
        broadcasts.get('drinkUpdate')();
        cb(obj);
    });
};

m.removeDrink = function (drinkID, cb) {
    drinkDatabaseInterface.deleteDrink(drinkID, function err(err) {
        cb(false);
        console.log(err);
    }, function callBack(obj) {
        broadcasts.get('drinkUpdate')();
        cb(obj);
    });
};

m.setPrice = function (data) {
    priceCalculator.setPrice(data.drinkID, data.price);
};

m.setDrink = function (data, cb) {
    drinkDatabaseInterface.setDrinkInfo(data.drinkID, data, function error(err) {
        cb(false);
        console.log(err);
    }, function callBack(obj) {
        broadcasts.get('drinkUpdate')();
        cb(obj);
    });
};

m.triggerStockCrash = function (decision) {
    priceCalculator.triggerStockCrash(decision);
};

getPriceOfDrink = function (priceID, drinkID, callBack) {
    //TODO: implement price entry cache, so you don't have to make a database request when several drinks are bought with the same priceID
    priceHistoryInterface.getPricesForID(priceID, function error(err) {
        console.log(err)
    }, function cb(obj) {
        callBack(obj.drinks[drinkID].price);
    });
};

addConsumption = function (drinks, guestID, priceID, callBack) {
    var saved = 0;
    var time = new Date().getTime();
    for (var i in drinks) {
        consumptionInterface.addConsumption(guestID, priceID, drinks[i].drinkID, drinks[i].quantity, time, function cb(obj) {
            saved++;
            if (drinks.length == saved) {
                callBack(true);
            }
        });
    }
};