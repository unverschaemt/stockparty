var priceHistoryInterface = require('./database/PriceHistoryInterface');
var drinkInterface = require('./database/DrinkInterface');
var config = require('./config.json');
var testData = require('./testdata.json');
var broadcasts = require('./connection/broadcasts.js');
var oldData = {};

var m = module.exports = {};

var refreshInterval = config.global.interval;
var calculating = config.global.running;
var timeOut;
var manuallySetPrices = [];

m.calculatePrices = function(callBack) {
  drinkInterface.getAllDrinks(function error(err) {}, function cb(obj) {
    /*only for testing*/
    var data = testData.shift();
    /*only for testing*/
    var drinksWithPrices = {};
    for (var i in obj) {
      drinksWithPrices[obj[i]._id] = {
        'id': obj[i]._id,
        'price': setPriceOfDrink(obj[i], data)
      };
    }
    saveNewDrinkPricesToDatabase(drinksWithPrices, callBack);
    broadcasts.get('priceUpdate')();
  });
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
    console.log(err)
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

setPriceOfDrink = function(drink, data) {
  var price;
  var manualPrice = manuallySetPrices[drink._id];
  if (manualPrice) {
    price = manualPrice;
    delete manuallySetPrices[drink._id];
  } else {
    price = calcPriceOfDrink(drink, data);
  }
  price = Math.round(price * 100) / 100;
  if (!oldData[drink.name]) {
    oldData[drink.name] = {
      sum: 0,
      times: 0
    };
  }
  oldData[drink.name].price = price;
  oldData[drink.name].sum += data[drink.name];
  oldData[drink.name].times += 1;
  oldData[drink.name].avg = oldData[drink.name].sum / oldData[drink.name].times;
  return price;
};

calcPriceOfDrink = function(drink, data) {
  var price;
  if (oldData[drink.name]) {
    if (data) {
      var rate = getSalesRate(oldData[drink.name], data[drink.name]);
      if (rate > 1) {
        price = oldData[drink.name].price + ((drink.priceMax - oldData[drink.name].price) * rate) / (drink.priceMax - drink.priceMin);
      } else if (rate < 1) {
        price = oldData[drink.name].price - ((oldData[drink.name].price - drink.priceMin) * rate) / (drink.priceMax - drink.priceMin);
      } else {
        price = oldData[drink.name].price;
      }
    }
  } else {
    //Calculated randomly
    price = Math.random() * (drink.priceMax - drink.priceMin) + drink.priceMin;
  }
  return price;
};

getSalesRate = function(oldData, newData) {
  var rate = 1;
  var avg = (oldData.sum + newData) / (oldData.times + 1)
  rate = avg / oldData.avg;
  //TODO damping factor -> in the beginning there are not so many datapoints to calculate the avg. There should be a damping factor, so the prices don't fluctuate too much


  return rate;
}

saveNewDrinkPricesToDatabase = function(drinks, callBack) {
  var data = {
    'time': new Date().getTime(),
    'drinks': drinks
  };
  priceHistoryInterface.addPriceHistory(data, callBack);
}
