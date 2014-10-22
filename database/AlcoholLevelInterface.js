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
        console.log("saved");
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
                        c++;
                        if(alcoholLevels.length == c){
                            error();
                        }
                    });
                }
            }
            if(alcoholLevels.length < 1){
                cb(c+" from "+alcoholLevels.length+" deleted good!");
            }
        }
    });
};

m.getAlcoholLevel = function (id, error, cb) {
    AlcoholLevel.findOne({
        _id: id
    }, function (err, alcoholLevel) {
        if (err) {
            error(err);
        } else {
            if (!alcoholLevel) {
                error();
            } else {
                cb(alcoholLevel);
            }
        }
        cb(alcoholLevel);
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