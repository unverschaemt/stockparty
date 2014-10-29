var priceHistoryInterface = require('./database/PriceHistoryInterface');
var drinkInterface = require('./database/DrinkInterface');
var config = require('./connection/config.js');

var m = module.exports = {};

var refreshInterval = config.data.global.interval;
var calculating = config.data.global.running;
var timeOut;
var manuallySetPrices = [];

m.calculatePrices = function () {
    drinkInterface.getAllDrinks(function error(err) {}, function cb(obj) {
        var drinksWithPrices = [];
        for (var i in obj) {
            drinksWithPrices.push({
                'id': obj[i]._id,
                'price': calcPriceForDrink(obj[i])
            });
        }
        saveNewDrinkPricesToDatabase(drinksWithPrices);
    });
};

m.setRefreshInterval = function (interval) {
    refreshInterval = interval;
    if (calculating) {
        clearInterval(timeOut);
        goCalculate();
    }
};

m.setPrice = function (drinkID, price) {
    manuallySetPrices[drinkID] = price;
};

m.triggerStockCrash = function (decision) {
    if (decision) return enableStockCrash();
    m.start();
};

m.triggerCalculation = function (decision) {
    if (!decision) return calculating = false;
    calculating = true;
    goCalculate();
};

goCalculate = function () {
    timeOut = setInterval(function loop() {
        if (calculating) {
            m.calculatePrices();
        } else {
            clearInterval(timeOut);
        }
    }, refreshInterval * 1000);
}

enableStockCrash = function () {
    m.pause();

    drinkInterface.getAllDrinks(function error(err) {
        console.log(err)
    }, function cb(obj) {
        var drinksWithPrices = [];
        for (var i in obj) {
            drinksWithPrices.push({
                'id': obj[i]._id,
                'price': obj[i].priceMin
            });
        }
        saveNewDrinkPricesToDatabase(drinksWithPrices);
    });
}

calcPriceForDrink = function (drink) {
    //TODO: create an useful algorithm
    var price;
    var manualPrice = manuallySetPrices[drink._id];
    if (manualPrice) {
        price = manualPrice;
        delete manuallySetPrices[drink._id];
    } else {
        price = Math.random() * (drink.priceMax - drink.priceMin) + drink.priceMin;
    }
    return price;
}

saveNewDrinkPricesToDatabase = function (drinks) {
    priceHistoryInterface.addPriceHistory(new Date().getTime(), drinks, function cb() {
        //TODO: notify new history entry was created
    });
}