var PriceHistory = require('./models/PriceHistory');
var q = require('q');

var m = module.exports = {};

m.addPriceHistory = function (time, drink, price) {
    var priceHistory = new PriceHistory({
        time: time,
        drink: drink,
        price: price
    });
    priceHistory.save(function (err, priceHistory) {
        if (err) return console.error(err);
        console.log("saved");
    });
};

m.deleteAllPriceHistory = function () {
    var deferred = q.defer();
    PriceHistory.find({
    }, function (err, priceHistorys) {
        if (err) {
            deferred.reject(err);
        } else {
            var c = 0;
            for(var i in priceHistorys){
                var priceHistory = priceHistorys[i];
                if (priceHistory) {
                    priceHistory.remove(function () {
                        c++;
                        if(priceHistorys.length == c){
                            deferred.resolve(c+" from "+priceHistorys.length+" deleted good!");
                        }
                    });
                }
            }
            if(priceHistorys.length < 1){
                deferred.resolve(c+" from "+priceHistorys.length+" deleted good!");
            }
        }
    });
    return deferred.promise;
};

m.getPricesForTime = function (time) {
    var deferred = q.defer();
    PriceHistory.find({time: time}, function (err, historyEntry) {
        if (err) {
            deferred.reject(err);
        } else {
            var ex = historyEntry;
            var temp = JSON.parse(JSON.stringify(ex));
            deferred.resolve(temp);
        }
    });
    return deferred.promise;
};

m.getPriceHistory = function () {
    var deferred = q.defer();
    PriceHistory.find({}, function (err, priceHistoryEntries) {
        if (err) {
            deferred.reject(err);
        } else {
            var ex = {};
            for (var i in priceHistoryEntries) {
                ex[priceHistoryEntries[i].time] = priceHistoryEntries[i];
            }
            var temp = JSON.parse(JSON.stringify(ex));
            deferred.resolve(temp);
        }
    });
    return deferred.promise;
};

