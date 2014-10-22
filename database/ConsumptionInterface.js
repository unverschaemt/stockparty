var Consumption = require('./models/Consumption');

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

m.deleteAllConsumptionEntries = function (error, cb) {
    Consumption.find({
    }, function (err, consumptions) {
        if (err) {
            error(err);
        } else {
            var c = 0;
            for(var i in consumptions){
                var consumption = consumptions[i];
                if (consumption) {
                    consumption.remove(function () {
                        c++;
                        if(consumptions.length == c){
                            cb(c+" from "+consumptions.length+" deleted good!");
                        }
                    });
                }
            }
            if(consumptions.length < 1){
                cb(c+" from "+consumptions.length+" deleted good!");
            }
        }
    });
};

m.deleteConsumption = function (id, error, cb) {
    Consumption.findOne({
        _id: id
    }, function (err, consumption) {
        if (err) {
            error(err);
        } else {
            if (!consumption) {
                cb(true);
            } else {
                consumption.remove(function () {
                    cb(true);
                });
            }
        }
    });
};

m.getConsumptionForGuest = function (guest, error, cb) {
    Consumption.find({guest: guest}, function (err, guests) {
        if (err) {
            error(err);
        } else {
            var ex = {};
            for (var i in guests) {
                ex[guests[i].time] = guests[i];
            }
            var temp = JSON.parse(JSON.stringify(ex));
            cb(temp);
        }
    });
};

m.getConsumption = function (error, cb) {
    Consumption.find({}, function (err, consumptionEntries) {
        if (err) {
            error(err);
        } else {
            var ex = {};
            for (var i in consumptionEntries) {
                ex[consumptionEntries[i].time] = consumptionEntries[i];
            }
            var temp = JSON.parse(JSON.stringify(ex));
            cb(temp);
        }
    });
};

