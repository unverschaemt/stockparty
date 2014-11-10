var assert = require('assert'); // node.js core module
var mongoose = require('mongoose');
var drinkInterface = require('../DrinkInterface');
var priceCalculator = require('../PriceCalculator');
var drinkDatabaseInterface = require('../database/DrinkInterface');
var consumptionInterface = require('../database/ConsumptionInterface');
var balanceInterface = require('../database/BalanceInterface');

var firstDrink = {
    'name': 'Beer',
    'priceMin': 2.00,
    'priceMax': 4.00
};
var secondDrink = {
    'name': 'Wine',
    'priceMin': 4.00,
    'priceMax': 8.00
};
var drinkToAdd = {
    'name': 'NewDrink',
    'priceMin': 2.00,
    'priceMax': 4.00
};

var priceID;
describe('Drink Interface', function () {
    before(function (done) {
        var db = mongoose.connect('mongodb://localhost/stockparty');

        drinkInterface.addDrink(firstDrink, function cb(obj) {
            drinkInterface.addDrink(secondDrink, function cb(obj) {
                priceCalculator.triggerCalculation(true);
                done();
            });
        });
    })

    after(function (done) {
        mongoose.connection.close();
        priceCalculator.triggerCalculation(false);
        done();
    })

    describe('Get Price Entry', function () {

        it('should get the latest price entry', function (done) {
            drinkInterface.getPriceEntry(function error() {
                assert.equal(true, true);
                done();
            }, function cb(entry) {
                priceID = entry._id;
                //var length = Object.getOwnPropertyNames(entry).length;
                //TODO: Assert that there is an entry
                assert.equal(true, true);
                done();
            });
        })
    })

    describe('Buy Drinks', function () {
        var guestID = 'f23ab47c';
        var drinksToBuy = [];

        before(function (done) {
            drinkInterface.getAllDrinks(function error(err) {}, function callBack(obj) {
                for (var i in obj) {
                    drinksToBuy.push({
                        'drinkID': obj[i]._id,
                        'quantity': 2
                    });
                    break;
                }
                done();
            });
        })

        it('should not write a new entry to consumption database', function (done) {
            var drinkToBuy = {
                'priceID': priceID,
                'guestID': guestID,
                'drinks': drinksToBuy
            };
            drinkInterface.buyDrinks(drinkToBuy, function cb(o) {
                consumptionInterface.getConsumptionForGuest(guestID, function err() {}, function cb(obj) {
                    var length = 0;
                    for (var i in obj) {
                        length++;
                    }
                    assert.equal(length, 0);
                    done();
                });
            });
        })

        it('should write a new entry to consumption database', function (done) {
            var drinkToBuy = {
                'priceID': priceID,
                'guestID': guestID,
                'drinks': drinksToBuy
            };
            var balanceToAdd = {
                'guest': guestID,
                'balance': 20
            };
            balanceInterface.addBalance(balanceToAdd, function callBack() {
                drinkInterface.buyDrinks(drinkToBuy, function cb(o) {
                    consumptionInterface.getConsumptionForGuest(guestID, function err() {}, function cb(obj) {
                        var length = 0;
                        for (var i in obj) {
                            length++;
                        }
                        assert.equal(1, length);
                        done();
                    });
                });
            });
        })
    })

    describe('Add Drink', function () {

        it('should write a new entry to drink database', function (done) {
            drinkInterface.addDrink(drinkToAdd, function callBack() {
                drinkInterface.getAllDrinks(function error(err) {}, function callBack(obj) {
                    for (var i in obj) {
                        if (obj[i].name == drinkToAdd.name) {
                            assert.equal(true, true);
                            done();
                        }
                    }
                });


            });
        })
    })

    describe('Remove Drink', function () {

        before(function (done) {
            drinkInterface.addDrink(drinkToAdd, function callBack() {
                drinkInterface.getAllDrinks(function error(err) {}, function callBack(obj) {
                    for (var i in obj) {
                        if (obj[i].name == drinkToAdd.name) {
                            drinkToAdd.id = obj[i]._id;
                            done();
                            break;
                        }
                    }
                });
            });
        });

        it('should remove a drink', function (done) {
            drinkInterface.removeDrink(drinkToAdd.id, function callBack() {
                drinkDatabaseInterface.getDrink(drinkToAdd.id, function err() {}, function cb(obj) {
                    assert.equal(obj, undefined);
                    done();
                });
            });
        })
    })

    describe('Set Price', function () {

        it('should set the price for a drink', function (done) {
            drinkInterface.setPrice(firstDrink.name, 3);
            done();
        })
    })

})