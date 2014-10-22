var AlcoholLevel = require('./models/AlcoholLevel');

var m = module.exports = {};

m.addAlcoholLevel = function (time, level, guest) {
    var alcoholLevel = new AlcoholLevel({
        time: time,
        level: level,
        guest: guest
    });
    alcoholLevel.save(function (err, alcoholLevel) {
        if (err) return console.error(err);
        console.log('saved');
    });
};

m.deleteAllAlcoholLevels = function (error, cb) {
    AlcoholLevel.find({
    }, function (err, alcoholLevels) {
        if (err) {
            error(err);
        } else {
            var c = 0;
            for(var i in alcoholLevels){
                var alcoholLevel = alcoholLevels[i];
                if (alcoholLevel) {
                    alcoholLevel.remove(function () {
                        cb('deleted all');
                    });
                }
            }
            if(alcoholLevels.length < 1){
                cb(c+' from '+alcoholLevels.length+' deleted good!');
            }
        }
    });
};

m.getAlcoholLevelsForOneGuest = function (guest, error, cb) {
    AlcoholLevel.find({
        guest: guest
    }, function (err, levels) {
        if (err) {
            error(err);
        } else {
            var ex = {};
            for (var i in levels) {
                ex[levels[i].time] = levels[i];
            }
            var temp = JSON.parse(JSON.stringify(ex));
            cb(temp);
        }
    });
};

m.getAllAlcoholLevels = function (error, cb) {
    AlcoholLevel.find({}, function (err, levels) {
        if (err) {
            error(err);
        } else {
            var ex = {};
            for (var i in levels) {
                ex[levels[i].time] = levels[i];
            }
            var temp = JSON.parse(JSON.stringify(ex));
            cb(temp);
        }
    });
};