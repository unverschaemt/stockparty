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
            if (!entry) {
                entry = {
                    'drinks': {}
                };
            }
            for (var i in drinks) {
                if (entry.drinks && !entry.drinks[i]) {
                    entry.drinks[i] = {
                        'id': i,
                        'price': (drinks[i].priceMax + drinks[i].priceMin) / 2
                    };
                }
            }
            callBack(entry);
        });
    })
};

m.getLatestXPriceHistoryEntries = function (options ,error, callBack) {
    priceHistoryInterface.getLatestXPriceHistoryEntries(options.x,error, function cb(history) {
        drinkDatabaseInterface.getAllDrinks(error, function cb(drinks) {
          if (!history) {
            history = {
                  'drinks': {}
              };
          }
          for (var i in drinks) {
              if (history.drinks && !history.drinks[i]) {
                history.drinks[i] = {
                      'id': i,
                      'price': (drinks[i].priceMax + drinks[i].priceMin) / 2
                  };
              }
          }
          callBack(history);
        });
    })
};

m.getPriceHistory = function (options ,error, callBack) {
    priceHistoryInterface.getPriceHistory(error, function cb(history) {
        drinkDatabaseInterface.getAllDrinks(error, function cb(drinks) {
            var numberOfDrinks = 0;
            for (var i in drinks) {
              numberOfDrinks++;
            }
            var dataPoints = reduceDataPointsForAllDrinks(history, numberOfDrinks);
            callBack(dataPoints);
        });
    })
};

reduceDataPointsForAllDrinks = function(history, numberOfDrinks){
  var drinks = {};
  var reducedDataPoints = {};
  for(var i in history){
    for(var drink in history[i].drinks){
      if(!drinks[drink]){
        drinks[drink] = [];
      }
      drinks[drink].push([history[i].time, history[i].drinks[drink].price]);
    }
  }
  for(var drink in drinks){
    reducedDataPoints[drink]=douglasPeucker(drinks[drink], 0.01);
  }
  return reducedDataPoints;
};

function douglasPeucker(points, epsilon) {
        var i,
            maxIndex = 0,
            maxDistance = 0,
            perpendicularDistance,
            leftRecursiveResults, rightRecursiveResults,
            filteredPoints;
        // find the point with the maximum distance
        for (i = 1; i < points.length - 1; i++) {
            perpendicularDistance = findPerpendicularDistance(points[i], [points[1], points[points.length - 1]]);
            if (perpendicularDistance > maxDistance) {
                maxIndex = i;
                maxDistance = perpendicularDistance;
            }
        }
        // if max distance is greater than epsilon, recursively simplify
        if (maxDistance >= epsilon) {
            leftRecursiveResults = douglasPeucker(points.slice(1, maxIndex), epsilon);
            rightRecursiveResults = douglasPeucker(points.slice(maxIndex), epsilon);
            filteredPoints = leftRecursiveResults.concat(rightRecursiveResults);
        } else {
            filteredPoints = points;
        }
        return filteredPoints;
};

function findPerpendicularDistance(point, line) {
        var pointX = point[0],
            pointY = point[1],
            lineStart = {
                x: line[0][0],
                y: line[0][1]
            },
            lineEnd = {
                x: line[1][0],
                y: line[1][1]
            },
            slope = (lineEnd.y - lineStart.y) / (lineEnd.x - lineStart.x),
            intercept = lineStart.y - (slope * lineStart.x),
            result;
        result = Math.abs(slope * pointX - pointY + intercept) / Math.sqrt(Math.pow(slope, 2) + 1);
        return result;
    }

m.buyDrinks = function (data, callBack) {
    var price = 0;
    var drinks = [];
    var l = 0;
    for (var i in data.drinks) {
        if (data.drinks[i].type == 'drink') {
            l++;
            getPriceOfDrink(data.priceID, data.drinks[i].drinkID, function cb(obj) {
                l--;
                price += obj * data.drinks[i].quantity;
                drinks.push(data.drinks[i]);
                if (l < 1) {
                    m.buy(data, drinks, callBack);
                }
            });
        } else {
            l++;
            balanceInterface.addBalance({
                'balance': data.drinks[i].balance,
                'guest': data.guestID
            }, function cb(bo) {
                l--;
                if (l < 1) {
                    m.buy(data, drinks, callBack);
                }
            });
        }
    }
    if (l < 1) {
        m.buy(data, drinks, callBack);
    }
};

m.buy = function (data, drinks, callBack) {
    guestInterface.getGuest(data.guestID, function error(err) {
        console.log(err);
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
        broadcasts.get('priceUpdate')();
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
