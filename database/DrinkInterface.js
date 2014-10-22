var Drink = require('./models/Drink');
var q = require('q');

var m = module.exports = {};

m.addDrink = function (name, priceMin, priceMax) {
    var drink = new Drink({
        name: name,
        priceMin: priceMin,
        priceMax: priceMax
    });
    drink.save(function (err, drink) {
        if (err) return console.error(err);
        console.log("saved");
    });
};

m.deleteDrink = function (id) {
    var deferred = q.defer();
    Drink.findOne({
        _id: id
    }, '_id name', function (err, drink) {
        if (err) {
            deferred.reject(err);
        } else {
            if (!drink) {
                deferred.reject(true);
            } else {
                drink.remove(function () {
                    deferred.resolve(true);
                });
            }
        }
    });
    return deferred.promise;
};

m.deleteAllDrinks = function () {
    var deferred = q.defer();
    Drink.find({
    }, function (err, drinks) {
        if (err) {
            deferred.reject(err);
        } else {
            var c = 0;
            for(var i in drinks){
                var drink = drinks[i];
                if (drink) {
                    drink.remove(function () {
                        c++;
                        if(drinks.length == c){
                            deferred.resolve(c+" from "+drinks.length+" deleted good!");
                        }
                    });
                }
            }
            if(drinks.length < 1){
                deferred.resolve(c+" from "+drinks.length+" deleted good!");
            }
        }
    });
    return deferred.promise;
};

m.getDrink = function (id) {
    var deferred = q.defer();
    Drink.findOne({
        _id: id
    }, function (err, drink) {
        if (err) {
            deferred.reject(err);
        } else {
            if (!drink) {
                deferred.reject(true);
            } else {
                if (drink.data && drink.metadata) {
                    deferred.resolve({
                        "buffer": drink.data,
                        "metadata": drink.metadata
                    });
                } else {
                    deferred.reject(true);
                }
            }
        }
    });
    return deferred.promise;
};

m.setDrinkInfo = function (id, data) {
    var deferred = q.defer();
    Drink.findOne({
        _id: id
    }, function (err, drink) {
        if (err) {
            deferred.reject(err);
        } else {
            if (!drink) {
                deferred.reject(true);
            } else {
                for (var k in data) {
                    if(k != "_id"){
                        drink[k] = data[k];
                        console.log("set drink "+k+" "+JSON.stringify(drink[k]));
                    }
                }
                drink.save(function (err, drink) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(drink._id);
                    }
                });
            }
        }
    });
    return deferred.promise;
};

m.getAllDrinks = function () {
    var deferred = q.defer();
    Drink.find({}, function (err, drinks) {
        if (err) {
            deferred.reject(err);
        } else {
            var ex = {};
            for (var i in drinks) {
                ex[drinks[i].time] = drinks[i];
            }
            var temp = JSON.parse(JSON.stringify(ex));
            deferred.resolve(temp);
        }
    });
    return deferred.promise;
};