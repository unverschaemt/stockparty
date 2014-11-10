var priceHistoryInterface = require('./database/PriceHistoryInterface');
var drinkInterface = require('./database/DrinkInterface');
var config = require('./config.json');
var triggerFunctions = require('./connection/triggerfunctions.js');
var testData = require('./testdata.json');
var oldDatas = {};
var oldPrices = {};

var m = module.exports = {};

var refreshInterval = config.global.interval;
var calculating = config.global.running;
var timeOut;
var manuallySetPrices = [];

m.calculatePrices = function () {
    drinkInterface.getAllDrinks(function error(err) {}, function cb(obj) {
        var data = testData.shift();
        var drinksWithPrices = {};
        for (var i in obj) {
            drinksWithPrices[obj[i]._id] = {
                'id': obj[i]._id,
                'price': calcPriceForDrink(obj[i], data)
            };
        }
        saveNewDrinkPricesToDatabase(drinksWithPrices);
        oldDatas = data;
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
    m.calculatePrices();
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

calcPriceForDrink = function (drink, data) {
    //TODO: create an useful algorithm
    var price;
    var manualPrice = manuallySetPrices[drink._id];
    if (manualPrice) {
        price = manualPrice;
        delete manuallySetPrices[drink._id];
    } else {
        if (Object.getOwnPropertyNames(oldDatas).length != 0) {
            if (data) {
                var rate = getSalesRate(oldDatas[drink.name], data[drink.name]);
                if (rate > 0) {
                    price = oldPrices[drink.name] + ((drink.priceMax - oldPrices[drink.name]) * Math.abs(rate));
                } else {
                    price = oldPrices[drink.name] - ((oldPrices[drink.name] - drink.priceMin) * Math.abs(rate));
                }
                console.log(drink.name + '  :  oldData: ' + oldDatas[drink.name] + '  newData: ' + data[drink.name] + '  rate: ' + rate + '   price: ' + price);
            }
        } else {
            //Calculated randomly
            price = Math.random() * (drink.priceMax - drink.priceMin) + drink.priceMin;
        }
        oldPrices[drink.name] = price;
    }
    //console.log(drink.name + '  :   ' + price);
    return price;
}
getSalesRate = function (oldData, newData) {
    var rate = 1;
    if (newData > 0 && oldData > 0) {
        if (oldData > newData) {
            rate = newData / oldData * (-1);
        } else {
            rate = oldData / newData;
        }
    } else {
        if (newData === 0 && oldData === 0) {
            rate = 1;
        } else if (newData === 0) {
            rate = -0.2;
        } else if (oldData === 0) {
            rate = 1 - (1 / newData);
        }
    }
    return rate;
}

saveNewDrinkPricesToDatabase = function (drinks) {
    var data = {
        'time': new Date().getTime(),
        'drinks': drinks
    };
    priceHistoryInterface.addPriceHistory(data, function cb() {
        triggerFunctions.onNewPriceEntry(data);
    });
}