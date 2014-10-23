var Consumption = require('./models/Consumption');

var m = module.exports = {};

m.addConsumption = function (guest, time, drink, quantity, cb) {
    var consumption = new Consumption({
        guest: guest,
        time: time,
        drink: drink,
        quantity: quantity
    });
    consumption.save(function (err, consumption) {
        if (err) return console.error(err);
        console.log('saved');
        cb(true);
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
                            cb(c+' from '+consumptions.length+' deleted good!');
                        }
                    });
                }
            }
            if(consumptions.length < 1){
                cb(c+' from '+consumptions.length+' deleted good!');
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

m.getAllConsumptionEntries = function (error, cb) {
    Consumption.find({}, function (err, consumptionEntries) {
        if (err) {
            error(err);
        } else {
            var ex = {};
            for (var i in consumptionEntries) {
                ex[consumptionEntries[i]._id] = consumptionEntries[i];
            }
            var temp = JSON.parse(JSON.stringify(ex));
            cb(temp);
        }
    });
};

