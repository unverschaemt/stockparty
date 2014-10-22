var AlcoholLevel = require('./models/AlcoholLevel');
var q = require('q');

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

m.deleteAllAlcoholLevels = function () {
    var deferred = q.defer();
    AlcoholLevel.find({
    }, function (err, alcoholLevels) {
        if (err) {
            deferred.reject(err);
        } else {
            var c = 0;
            for(var i in alcoholLevels){
                var alcoholLevel = alcoholLevels[i];
                if (alcoholLevel) {
                    alcoholLevel.remove(function () {
                        c++;
                        if(alcoholLevels.length == c){
                            deferred.resolve(c+" from "+alcoholLevels.length+" deleted good!");
                        }
                    });
                }
            }
            if(alcoholLevels.length < 1){
                deferred.resolve(c+" from "+alcoholLevels.length+" deleted good!");
            }
        }
    });
    return deferred.promise;
};

m.getAlcoholLevel = function (id) {
    var deferred = q.defer();
    AlcoholLevel.findOne({
        _id: id
    }, '_id data metadata', function (err, alcoholLevel) {
        if (err) {
            deferred.reject(err);
        } else {
            if (!alcoholLevel) {
                deferred.reject(true);
            } else {
                if (alcoholLevel.data && alcoholLevel.metadata) {
                    deferred.resolve({
                        "buffer": alcoholLevel.data,
                        "metadata": alcoholLevel.metadata
                    });
                } else {
                    deferred.reject(true);
                }
            }
        }
    });
    return deferred.promise;
};

m.getAllAlcoholLevels = function () {
    var deferred = q.defer();
    AlcoholLevel.find({}, function (err, levels) {
        if (err) {
            deferred.reject(err);
        } else {
            var ex = {};
            for (var i in levels) {
                ex[levels[i].time] = levels[i];
            }
            var temp = JSON.parse(JSON.stringify(ex));
            deferred.resolve(temp);
        }
    });
    return deferred.promise;
};