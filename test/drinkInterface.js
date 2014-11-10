var assert = require('assert'); // node.js core module
var mongoose = require('mongoose');
var drinkInterface = require('../DrinkInterface');
var priceCalculator = require('../PriceCalculator');
var drinkDatabaseInterface = require('../database/DrinkInterface');
var consumptionInterface = require('../database/ConsumptionInterface');
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

        drinkInterface.addDrink(firstDrink, function cb() {
            drinkInterface.addDrink(secondDrink, function cb() {
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
            drinkInterface.getPriceEntry(function error() {}, function cb(entry) {
                priceID = entry._id;
                var length = Object.getOwnPropertyNames(entry).length;
                //TODO: Assert that there is an entry
                done();
            });
        })
    })

    describe('Buy Drinks', function () {
        var guestID = 'f23ab47c';
        var drinksToBuy = [{
            'drinkID': firstDrink.name,
            'quantity': 2
        }];

        it('should write a new entry to consumption database', function (done) {
            var drinkToBuy = {
                'priceID': priceID,
                'guestID': guestID,
                'drinks': drinksToBuy
            };
            drinkInterface.buyDrinks(drinkToBuy, function cb() {
                consumptionInterface.getConsumptionForGuest(guestID, function err() {}, function cb(obj) {
                    var length = 0;
                    for (var i in obj) {
                        length++;
                    }
                    assert.equals(length, 1);
                    done();
                });
            });
        })
    })

    describe('Add Drink', function () {

        it('should write a new entry to drink database', function (done) {
            drinkInterface.addDrink(drinkToAdd);
            drinkDatabaseInterface.getDrink(drinkToAdd.name, function err() {}, function cb(obj) {
                assert.equals(obj, Object);
                done();
            });
        })
    })

    describe('Remove Drink', function () {

        it('should write a new entry to consumption database', function (done) {
            drinkInterface.removeDrink(drinkToAdd.name);
            drinkDatabaseInterface.getDrink(drinkToAdd.name, function err() {}, function cb(obj) {
                assert.equals(obj, undefined);
                done();
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