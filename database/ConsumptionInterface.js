var Consumption = require('./models/Consumption');
var q = require('q');

var m = module.exports = {};

m.addConsumption = function (guest, time, drink, quantity) {
    var consumption = new Consumption({
        guest: guest,
        time: time,
        drink: drink,
        quantity: quantity
    });
    consumption.save(function (err, consumption) {
        if (err) return console.error(err);
        console.log("saved");
    });
};

m.deleteAllConsumptionEntries = function () {
    var deferred = q.defer();
    Consumption.find({
    }, function (err, consumptions) {
        if (err) {
            deferred.reject(err);
        } else {
            var c = 0;
            for(var i in consumptions){
                var consumption = consumptions[i];
                if (consumption) {
                    consumption.remove(function () {
                        c++;
                        if(consumptions.length == c){
                            deferred.resolve(c+" from "+consumptions.length+" deleted good!");
                        }
                    });
                }
            }
            if(consumptions.length < 1){
                deferred.resolve(c+" from "+consumptions.length+" deleted good!");
            }
        }
    });
    return deferred.promise;
};

m.deleteConsumption = function (id) {
    var deferred = q.defer();
    Consumption.findOne({
        _id: id
    }, '_id name', function (err, consumption) {
        if (err) {
            deferred.reject(err);
        } else {
            if (!consumption) {
                deferred.reject(true);
            } else {
                consumption.remove(function () {
                    deferred.resolve(true);
                });
            }
        }
    });
    return deferred.promise;
};

m.getConsumptionForGuest = function (guest) {
    var deferred = q.defer();
    Consumption.find({guest: guest}, function (err, guests) {
        if (err) {
            deferred.reject(err);
        } else {
            var ex = {};
            for (var i in guests) {
                ex[guests[i].time] = guests[i];
            }
            var temp = JSON.parse(JSON.stringify(ex));
            deferred.resolve(temp);
        }
    });
    return deferred.promise;
};

m.getConsumption = function () {
    var deferred = q.defer();
    Consumption.find({}, function (err, consumptionEntries) {
        if (err) {
            deferred.reject(err);
        } else {
            var ex = {};
            for (var i in consumptionEntries) {
                ex[consumptionEntries[i].time] = consumptionEntries[i];
            }
            var temp = JSON.parse(JSON.stringify(ex));
            deferred.resolve(temp);
        }
    });
    return deferred.promise;
};

