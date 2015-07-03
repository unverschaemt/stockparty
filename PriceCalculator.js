var priceHistoryInterface = require('./database/PriceHistoryInterface');
var drinkInterface = require('./database/DrinkInterface');
var alcoholLevelInterface = require('./database/AlcoholLevelInterface');
var consumptionInterface = require('./database/ConsumptionInterface');
var config = require('./config.json');
var broadcasts = require('./connection/broadcasts.js');
var oldData = {};

var m = module.exports = {};

var refreshInterval = config.global.interval;
var calculating = config.global.running;
var timeOut;
var manuallySetPrices = [];
var priceObservers = [];

m.calculatePrices = function(callBack) {
  drinkInterface.getAllDrinks(function error(err) {}, function cb(drinks) {
    consumptionInterface.getAllConsumptionsGreaterThanTime(oldData.time, function err(err) {
      console.error(err);
    }, function(consumptions) {
      var data = convertConsumptions(drinks, consumptions);
      alcoholLevelInterface.getAllAlcoholLevelsGreaterThanTime(oldData.time, function err(err) {
        console.error(err)
      }, function(alcoholLevels) {
        var drinksWithPrices = {};
        var rates = [];
        if (config.global.alcoholCalculation) {
          rates.push(getAlcoholLevelRate(alcoholLevels));
        }
        for (var i in drinks) {
          drinksWithPrices[drinks[i]._id] = {
            'id': drinks[i]._id,
            'price': setPriceOfDrink(drinks[i], data, rates)
          };
          console.log('drink: ' + drinksWithPrices[drinks[i]._id].id, drinksWithPrices[drinks[i]._id].price);
        }
        saveNewDrinkPricesToDatabase(drinksWithPrices, callBack);
        broadcasts.get('priceUpdate')();
        //updatePriceObservers(drinksWithPrices);
      });
    });
  });
};

m.registerPriceObserver = function(observer){
   priceObservers.push(observer);
};

updatePriceObservers = function(drinksWithPrices) {
   for(var observer in priceObservers){
      priceObservers[observer].onPriceUpdate(drinksWithPrices);
   }
}

convertConsumptions = function(drinks, consumptions) {
  var data = {};
  for (var i in drinks) {
    data[i] = 0;
  }
  for (var i in consumptions) {
    data[consumptions[i].drink] += consumptions[i].quantity;
  }
  return data;
};

m.setRefreshInterval = function(interval) {
  refreshInterval = interval;
  if (calculating) {
    clearInterval(timeOut);
    goCalculate();
  }
};

m.getRefreshInterval = function() {
  return refreshInterval;
};

m.setPrice = function(drinkID, price) {
  manuallySetPrices[drinkID] = price;
};

m.triggerStockCrash = function(decision) {
  if (decision) return enableStockCrash();
  m.triggerCalculation(true);
};

m.triggerCalculation = function(decision) {
  if (!decision) return calculating = false;
  calculating = true;
  goCalculate();
};

m.getStatus = function() {
  return calculating;
};

goCalculate = function() {
  m.calculatePrices(function cb() {});
  timeOut = setInterval(function loop() {
    if (calculating) {
      m.calculatePrices(function cb() {});
    } else {
      clearInterval(timeOut);
    }
  }, refreshInterval * 1000);
}

enableStockCrash = function() {
  //TODO: recognize stockcrash in price calculation

  m.triggerCalculation(false);

  drinkInterface.getAllDrinks(function error(err) {
    console.error(err)
  }, function cb(obj) {
    var drinksWithPrices = {};
    for (var i in obj) {
      drinksWithPrices[i] = {
        'id': obj[i]._id,
        'price': obj[i].priceMin
      };
    }
    saveNewDrinkPricesToDatabase(drinksWithPrices, function cb() {
      broadcasts.get('priceUpdate')();
    });
  });
}

setPriceOfDrink = function(drink, data, rates) {
  var price;
  var manualPrice = manuallySetPrices[drink._id];
  if (manualPrice) {
    price = manualPrice;
    delete manuallySetPrices[drink._id];
  } else {
    price = calcPriceOfDrink(drink, data, rates.slice());
  }
  price = Math.round(price * 100) / 100;
  if (!oldData[drink._id]) {
    oldData[drink._id] = {
      sum: 0,
      times: 0
    };
  }
  oldData[drink._id].price = price;
  oldData[drink._id].sum += data[drink._id];
  oldData[drink._id].times += 1;
  oldData[drink._id].avg = oldData[drink._id].sum / oldData[drink._id].times;
  return price;
};

calcPriceOfDrink = function(drink, data, rates) {
  var price;
  if (oldData[drink._id]) {
    if (data) {
      rates.push(getSalesRate(oldData[drink._id], data[drink._id]));
      price = applyRatesToPrice(rates, drink);
    }
  } else {
    //Calculated randomly
    price = Math.random() * (drink.priceMax - drink.priceMin) + drink.priceMin;
  }
  return price;
};

applyRatesToPrice = function(rates, drink) {
  var price = oldData[drink._id].price;
  for (var i in rates) {
    if (rates[i] > 1) {
      price += ((drink.priceMax - price) * rates[i]) / (drink.priceMax - drink.priceMin);
    } else if (rates[i] < 1) {
      price -= ((price - drink.priceMin) * rates[i]) / (drink.priceMax - drink.priceMin);
    }
  }
  return price;
};

getSalesRate = function(oldData, newData) {
  var rate = 1;
  var avg = (oldData.sum + newData) / (oldData.times + 1);
  if (oldData.avg != 0) {
    rate = avg / oldData.avg;
  } else {
    rate = avg;
  }
  //TODO damping factor -> in the beginning there are not so many datapoints to calculate the avg. There should be a damping factor, so the prices don't fluctuate too much

  return rate;
}

getAlcoholLevelRate = function(alcoholLevels) {
  var rate = 1;
  if (alcoholLevels.length > 0) {
    var avg = getAlcoholLevelAverage(alcoholLevels);
    if (oldData.alcoholLevel) {
      rate = avg / oldData.alcoholLevel;
    }
    oldData.alcoholLevel = avg;
  }
  return rate;
};

getAlcoholLevelAverage = function(alcoholLevels) {
  var avg = 0;
  var sum = 0;
  for (var i in alcoholLevels) {
    sum += alcoholLevels[i].level;
  }
  return sum / alcoholLevels.length;
};

saveNewDrinkPricesToDatabase = function(drinks, callBack) {
  var time = new Date().getTime();
  var data = {
    'time': time,
    'drinks': drinks
  };
  oldData.time = time;
  priceHistoryInterface.addPriceHistory(data, callBack);
}
