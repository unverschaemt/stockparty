var priceHistoryInterface = require('./database/PriceHistoryInterface');
var drinkInterface = require('./database/DrinkInterface');

var m = module.exports = {};

var refreshInterval =5;
var calculating = false;
var timeOut;
var manuallySetPrices = [];

m.calculatePrices = function () {
    drinkInterface.getAllDrinks(function error(err){}, function cb(obj){
        var drinksWithPrices = [];
        for(var i in obj){
            drinksWithPrices.push({'id': obj[i]._id, 'price': calcPriceForDrink(obj[i])});
        }
        saveNewDrinkPricesToDatabase(drinksWithPrices);
    });
};

m.setRefreshInterval = function (interval) {
    refreshInterval = interval;
    if(calculating){
        clearInterval(timeOut);
        goCalculate();
    }
};

m.getRefreshInterval = function () {
    return refreshInterval;
};

m.setPrice = function (drinkID, price) {
    manuallySetPrices[drinkID] = price;
};

m.triggerStockCrash = function (decision) {
    if(decision){
          enableStockCrash();
    }else{
        this.start();   
    }
};

m.start = function () {
    calculating = true;
    goCalculate();
};

m.pause = function () {
    calculating = false;
};

m.isWorking = function () {
    return calculating;
};

goCalculate = function(){
    
        timeOut = setInterval(function loop(){
            if(calculating){
            	m.calculatePrices();
            }else{
                clearInterval(timeOut);
            }
        }, refreshInterval*1000);
    
}

enableStockCrash = function (){
    this.pause();
    
    drinkInterface.getAllDrinks(function error(err){}, function cb(obj){
        var drinksWithPrices = [];
        for(var i in obj){
            drinksWithPrices.push({'id': obj[i]._id, 'price': obj[i].priceMin});
        }
        saveNewDrinkPricesToDatabase(drinksWithPrices);
    });
    
}

calcPriceForDrink = function(drink){    
    //TODO: create an useful algorithm
    var price;
    var manualPrice = manuallySetPrices[drink.name];
    if(manualPrice){
        price = manualPrice;
        delete manuallySetPrices[drink.name];
    }else{
        price = Math.random() * (drink.priceMax - drink.priceMin) + drink.priceMin;
    }
    return price;
}

saveNewDrinkPricesToDatabase = function(drinks){    
    priceHistoryInterface.addPriceHistory(new Date().getTime(), drinks, function cb(){
        //TODO: notify new history entry was created
    });
}