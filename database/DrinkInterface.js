var Drink = require('./models/Drink');

var m = module.exports = {};

m.addDrink = function (name, size, priceMin, priceMax, cb) {
    var drink = new Drink({
        name: name,
        size: size,
        priceMin: priceMin,
        priceMax: priceMax,
        soldOut: true
    });
    drink.save(function (err, drink) {
        if (err) return console.error(err);
        console.log('saved drink');
        cb(true);
    });
};

m.deleteDrink = function (id, error, cb) {
    Drink.findOne({
        _id: id
    }, function (err, drink) {
        if (err) {
            error(err);
        } else {
            if (!drink) {
                cb(true);
            } else {
                drink.remove(function () {
                    cb(true);
                });
            }
        }
    });
};

m.deleteAllDrinks = function (error, cb) {
    Drink.find({}, function (err, drinks) {
        if (err) {
            error(err);
        } else {
            var c = 0;
            for (var i in drinks) {
                var drink = drinks[i];
                if (drink) {
                    drink.remove(function () {
                        c++;
                        if (drinks.length == c) {
                            cb(c + " from " + drinks.length + " deleted good!");
                        }
                    });
                }
            }
            if (drinks.length < 1) {
                cb(c + " from " + drinks.length + " deleted good!");
            }
        }
    });
};

m.getDrink = function (id, error, cb) {
    Drink.findOne({
        _id: id
    }, function (err, drink) {
        if (err) {
            error(err);
        } else {
            cb(drink);
        }
    });
};

m.setDrinkInfo = function (id, data, error, cb) {
    Drink.findOne({
        _id: id
    }, function (err, drink) {
        if (err) {
            error(err);
        } else {
            if (!drink) {
                cb(false);
            } else {
                for (var k in data) {
                    if (k != "_id") {
                        drink[k] = data[k];
                        console.log("set drink " + k + " " + JSON.stringify(drink[k]));
                    }
                }
                drink.save(function (err, drink) {
                    if (err) {
                        error(err);
                    } else {
                        cb(true);
                    }
                });
            }
        }
    });
};

m.getAllDrinks = function (error, cb) {
    Drink.find({}, function (err, drinks) {
        if (err) {
            error(err);
        } else {
            var ex = {};
            for (var i in drinks) {
                ex[drinks[i]._id] = drinks[i];
            }
            var temp = JSON.parse(JSON.stringify(ex));
            cb(temp);
        }
    });
};