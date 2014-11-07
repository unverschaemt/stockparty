var AlcoholLevel = require('./models/AlcoholLevel');

var m = module.exports = {};

m.addAlcoholLevel = function (time, level, guest, cb) {
    var alcoholLevel = new AlcoholLevel({
        time: time,
        level: level,
        guest: guest
    });
    alcoholLevel.save(function (err, alcoholLevel) {
        if (err) return console.error(err);
        console.log('saved alcohol level');
        cb(true);
    });
};

m.deleteAllAlcoholLevels = function (error, cb) {
    AlcoholLevel.find({
    }, function (err, alcoholLevels) {
        if (err) {
            error(err);
        } else {
            for(var i in alcoholLevels){
                var alcoholLevel = alcoholLevels[i];
                if (alcoholLevel) {
                    alcoholLevel.remove(function () {
                    });
                }
            }
            cb('deleted all alcohol levels');
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

m.getAlcoholLevel = function (time, error, cb) {
    AlcoholLevel.findOne({
        time: time
    }, function (err, level) {
        if (err) {
            error(err);
        } else {
            cb(level);
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