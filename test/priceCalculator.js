var assert = require('assert'); // node.js core module
var mongoose = require('mongoose');
var priceCalculator = require('../PriceCalculator');
var priceHistoryInterface = require('../database/PriceHistoryInterface');
var drinkInterface = require('../database/DrinkInterface');

describe('Price Calculator', function () {
    before(function (done) {
        var db = mongoose.connect('mongodb://localhost/test');
        done();
    })

    after(function (done) {
        mongoose.connection.db.dropDatabase();
        mongoose.connection.close();
        done();
    })

    describe('Calculate Price', function () {
        it('should write new prices in price history', function (done) {
            priceCalculator.calculatePrices(function callBack() {
                priceHistoryInterface.getPriceHistory(function error(err) {}, function cb(obj) {
                    var length = 0;
                    for (var i in obj) {
                        length++;
                    }
                    assert.equal(length, 1);
                    done();
                });
            });
        })
    })

    describe('Set Refresh Interval', function () {

        it('should set refresh Interval to new Interval', function () {
            var interval = 2;
            priceCalculator.setRefreshInterval(interval);
            assert.equal(priceCalculator.getRefreshInterval(), interval);
        })
    })


    describe('Trigger Stock Crash', function () {
        var firstDrink = {
            'name': 'Beer',
            'size': 0.3,
            'priceMin': 2.00,
            'priceMax': 4.00,
            'soldOut': false
        };
        var secondDrink = {
            'name': 'Wine',
            'size': 0.3,
            'priceMin': 4.00,
            'priceMax': 8.00,
            'soldOut': false
        };

        before(function (done) {
            drinkInterface.addDrink(firstDrink, function cb(obj) {
                drinkInterface.addDrink(secondDrink, function cb(obj) {
                    priceCalculator.triggerCalculation(true);
                    done();
                });
            });
        })

        after(function (done) {
            drinkInterface.deleteAllDrinks(function error(err) {}, function cb(obj) {
                done();
            });
        })

        it('should set all prices to lowest', function (done) {
            priceCalculator.triggerStockCrash(true);

            priceHistoryInterface.getPriceHistory(function error(err) {}, function cb(obj) {
                var tested1 = true;
                var tested2 = true;
                for (var i in obj) {
                    if (obj[i].name == firstDrink.name) {
                        assert.equal(obj[i].drinks[firstDrink.name].price, firstDrink.priceMin);
                        tested1 = true;
                    } else if (obj[i].name == secondDrink.name) {
                        assert.equal(obj[i].drinks[secondDrink.name].price, secondDrink.priceMin);
                        tested2 = true;
                    }
                }
                assert.equal(tested1, true);
                assert.equal(tested2, true);
                done();
            });
        })

        it('should pause the calculation algorithm', function () {
            priceCalculator.triggerStockCrash(true);
            assert.equal(priceCalculator.getStatus(), false);
        })

        it('should start the calculation algorithm', function () {
            priceCalculator.triggerStockCrash(false);
            assert.equal(priceCalculator.getStatus(), true);
        })
    })

    describe('Start Calculation Algorithm', function () {

        it('should start the calculation algorithm', function () {
            priceCalculator.triggerCalculation(true);
            assert.equal(priceCalculator.getStatus(), true);
        })
    })

    describe('Pause Calculation Algorithm', function () {

        it('should pause the calculation algorithm', function () {
            priceCalculator.triggerCalculation(false);
            assert.equal(priceCalculator.getStatus(), false);
        })
    })

})
