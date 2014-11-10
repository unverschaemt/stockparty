var assert = require('assert'); // node.js core module
var mongoose = require('mongoose');
var userInterface = require('../database/UserInterface');
var drinkInterface = require('../database/DrinkInterface');
var guestInterface = require('../database/GuestInterface');
var alcoholLevelInterface = require('../database/AlcoholLevelInterface');
var consumptionInterface = require('../database/ConsumptionInterface');
var priceHistoryInterface = require('../database/PriceHistoryInterface');
var md5 = require('MD5');

// Create db connection
var db;

describe('Database Interfaces', function () {

    before(function (done) {
        db = mongoose.connect('mongodb://localhost/stockparty');
        done();
    })

    after(function (done) {
        mongoose.connection.close();
        done();
    })

    describe('User Interface', function () {
        var userToCreate = {
            'userName': 'UserName',
            'password': 'Password',
            'name': 'Name',
            'role': {
                'role': 'role'
            }
        };

        afterEach(function (done) {
            userInterface.deleteUser(userToCreate.userName, function cb(obj) {
                done();
            });
        })

        it('should add a user to database', function (done) {
            userInterface.addUser(userToCreate, function cb() {

                userInterface.getUser(userToCreate.userName, function error(err) {}, function cb(obj) {
                    assert.equal(userToCreate.userName, obj.userName);
                    assert.equal(userToCreate.password, obj.password);
                    assert.equal(userToCreate.name, obj.name);
                    assert.deepEqual(userToCreate.role, obj.role);
                    done();
                });
            });
        })

        it('should change the password of an user', function (done) {
            userInterface.addUser(userToCreate, function cb() {

                var userInformation = {
                    'password': 'NewPassword',
                    'userName': userToCreate.userName
                };
                userInterface.setUserInfo(userInformation, function cb(obj) {
                    userInterface.getUser(userToCreate.userName, function error(err) {
                        console.log(err)
                    }, function cb(user) {
                        assert.equal(user.password, md5(userInformation.password));
                        done();
                    });
                });
            });
        })

        it('should delete an user', function (done) {
            userInterface.addUser(userToCreate, function cb() {

                userInterface.deleteUser(userToCreate.userName, function cb(obj) {
                    userInterface.getUser(userToCreate.userName, function error(err) {
                        assert.equal(err, 'User not found!');
                        done();
                    }, function cb(obj) {});
                });
            });
        })
    })

    describe('Guest Interface', function () {
        var guestToCreate = {
            'idk': 'f23ab47c',
            'name': 'Name',
            'birthDate': 12.12
        };

        afterEach(function (done) {
            guestInterface.deleteAllGuests(function error(err) {}, function cb(obj) {
                done();
            });
        })

        it('should add a guest to database', function (done) {
            guestInterface.addGuest(guestToCreate.idk, guestToCreate.name, guestToCreate.birthDate, function error(err) {}, function cb() {
                guestInterface.getGuest(guestToCreate.idk, function error(err) {}, function cb(obj) {
                    assert.equal(guestToCreate.idk, obj.idk);
                    assert.equal(guestToCreate.name, obj.name);
                    assert.equal(guestToCreate.birthDate, obj.birthDate);
                    done();
                });
            });
        })

        it('should not add two guests with the same idk', function (done) {
            guestInterface.addGuest(guestToCreate.idk, guestToCreate.name, guestToCreate.birthDate, function error(err) {}, function cb() {
                guestInterface.addGuest(guestToCreate.idk, guestToCreate.name, guestToCreate.birthDate, function error(err) {
                    done();
                }, function cb() {});
            });
        })

        it('should add a guest, even if it has no idk', function (done) {
            guestInterface.addGuest('', guestToCreate.name, guestToCreate.birthDate, function error(err) {}, function cb() {
                guestInterface.getGuest('', function error(err) {}, function cb(obj) {
                    assert.equal('', obj.idk);
                    assert.equal(guestToCreate.name, obj.name);
                    assert.equal(guestToCreate.birthDate, obj.birthDate);
                    done();
                });
            });
        })

        it('should delete a guest', function (done) {
            guestInterface.addGuest(guestToCreate.idk, guestToCreate.name, guestToCreate.birthDate, function error(err) {}, function cb() {

                guestInterface.deleteGuest(guestToCreate.idk, function error(err) {}, function cb(obj) {
                    guestInterface.getGuest(guestToCreate.idk, function error(err) {}, function cb(obj) {
                        assert.equal(obj, true);
                        done();
                    });
                });
            });
        })
        it('should delete all guests', function (done) {
            var differentGuestToCreate = {
                'idk': 'f23ab47d',
                'name': 'Name',
                'birthDate': 12.12
            };

            guestInterface.addGuest(guestToCreate.idk, guestToCreate.name, guestToCreate.birthDate, function error(err) {}, function cb() {
                guestInterface.addGuest(differentGuestToCreate.idk, differentGuestToCreate.name, differentGuestToCreate.birthDate, function error(err) {}, function cb() {

                    guestInterface.deleteAllGuests(function error(err) {}, function cb(obj) {
                        guestInterface.getGuest(guestToCreate.idk, function error(err) {}, function cb(obj) {
                            assert.equal(obj, true);
                            guestInterface.getGuest(differentGuestToCreate.idk, function error(err) {}, function cb(obj) {
                                assert.equal(obj, true);
                                done();
                            });
                        });
                    });
                });
            });
        })
    })

    describe('Drink Interface', function () {
        var drinkToCreate = {
            'name': 'Name',
            'priceMin': 5.00,
            'priceMax': 8.00
        };

        afterEach(function (done) {
            drinkInterface.deleteAllDrinks(function error(err) {}, function cb(obj) {
                done();
            });
        })

        it('should add a drink to database', function (done) {
            drinkInterface.addDrink(drinkToCreate.name, drinkToCreate.priceMin, drinkToCreate.priceMax, function cb() {
                done();
            });
        })

        it('should get all drinks', function (done) {
            var differentDrinkToCreate = {
                'name': 'DifferentName',
                'priceMin': 5.00,
                'priceMax': 8.00
            };
            drinkInterface.addDrink(drinkToCreate.name, drinkToCreate.priceMin, drinkToCreate.priceMax, function cb() {
                drinkInterface.addDrink(differentDrinkToCreate.name, differentDrinkToCreate.priceMin, differentDrinkToCreate.priceMax, function cb() {
                    drinkInterface.getAllDrinks(function error(err) {}, function cb(obj) {
                        done();
                    });
                });
            });
        })

        it('should delete all drinks', function (done) {
            var differentDrinkToCreate = {
                'name': 'DifferentName',
                'priceMin': 5.00,
                'priceMax': 8.00
            };
            drinkInterface.addDrink(drinkToCreate.name, drinkToCreate.priceMin, drinkToCreate.priceMax, function cb() {
                drinkInterface.addDrink(differentDrinkToCreate.name, differentDrinkToCreate.priceMin, differentDrinkToCreate.priceMax, function cb() {

                    drinkInterface.deleteAllDrinks(function error(err) {}, function cb(obj) {
                        done();
                    });
                });
            });
        })
    })

    describe('AlcoholLevel Interface', function () {
        var levelToCreate = {
            'time': 201410231228,
            'level': 2.00,
            'guest': 'f23ab47c'
        };

        afterEach(function (done) {
            alcoholLevelInterface.deleteAllAlcoholLevels(function error(err) {}, function cb(obj) {
                done();
            });
        })

        it('should add a level to database', function (done) {
            alcoholLevelInterface.addAlcoholLevel(levelToCreate.time, levelToCreate.level, levelToCreate.guest, function cb() {

                alcoholLevelInterface.getAlcoholLevel(levelToCreate.time, function error(err) {}, function cb(obj) {
                    assert.equal(levelToCreate.time, obj.time);
                    assert.equal(levelToCreate.level, obj.level);
                    assert.equal(levelToCreate.guest, obj.guest);
                    done();
                });
            });
        })

        it('should get all levels for one person', function (done) {
            var differentLevelToCreate = {
                'time': 201410231229,
                'level': 2.00,
                'guest': 'f23ab47c'
            };
            var differentLevelForGuestToCreate = {
                'time': 201410231230,
                'level': 2.00,
                'guest': 'f23ab47d'
            };
            alcoholLevelInterface.addAlcoholLevel(levelToCreate.time, levelToCreate.level, levelToCreate.guest, function cb() {
                alcoholLevelInterface.addAlcoholLevel(differentLevelToCreate.time, differentLevelToCreate.level, differentLevelToCreate.guest, function cb() {
                    alcoholLevelInterface.addAlcoholLevel(differentLevelForGuestToCreate.time, differentLevelForGuestToCreate.level, differentLevelForGuestToCreate.guest, function cb() {
                        alcoholLevelInterface.getAlcoholLevelsForOneGuest(levelToCreate.guest, function error(err) {}, function cb(obj) {
                            assert.equal(levelToCreate.time, obj[levelToCreate.time].time);
                            assert.equal(differentLevelToCreate.time, obj[differentLevelToCreate.time].time);
                            assert.equal(obj[differentLevelForGuestToCreate.time], undefined);
                            done();
                        });
                    });
                });
            });
        })


        it('should return all alcohol levels', function (done) {
            var differentLevelToCreate = {
                'time': 201410231229,
                'level': 2.00,
                'guest': 'f23ab47c'
            };
            var differentLevelForGuestToCreate = {
                'time': 201410231230,
                'level': 2.00,
                'guest': 'f23ab47d'
            };
            alcoholLevelInterface.addAlcoholLevel(levelToCreate.time, levelToCreate.level, levelToCreate.guest, function cb() {
                alcoholLevelInterface.addAlcoholLevel(differentLevelToCreate.time, differentLevelToCreate.level, differentLevelToCreate.guest, function cb() {
                    alcoholLevelInterface.addAlcoholLevel(differentLevelForGuestToCreate.time, differentLevelForGuestToCreate.level, differentLevelForGuestToCreate.guest, function cb() {
                        alcoholLevelInterface.getAllAlcoholLevels(function error(err) {}, function cb(obj) {
                            assert.equal(levelToCreate.time, obj[levelToCreate.time].time);
                            assert.equal(differentLevelToCreate.time, obj[differentLevelToCreate.time].time);
                            assert.equal(differentLevelForGuestToCreate.time, obj[differentLevelForGuestToCreate.time].time);
                            done();
                        });
                    });
                });
            });
        })
    })

    describe('Consumption Interface', function () {
        var consumptionToCreate = {
            'guest': 'f23ab47c',
            'priceID': 201410231228,
            'drink': 'DrinkName',
            'quantity': 2,
            'time': 201410231328
        };

        afterEach(function (done) {
            consumptionInterface.deleteAllConsumptionEntries(function error(err) {}, function cb(obj) {
                done();
            });
        })

        it('should add a consumption to database', function (done) {
            consumptionInterface.addConsumption(consumptionToCreate.guest, consumptionToCreate.priceID, consumptionToCreate.drink, consumptionToCreate.quantity, consumptionToCreate.time, function cb() {
                consumptionInterface.getAllConsumptionEntries(function error(err) {}, function cb(obj) {
                    for (var i in obj) {
                        assert.equal(consumptionToCreate.priceID, obj[i].priceID);
                        assert.equal(consumptionToCreate.consumption, obj[i].consumption);
                        assert.equal(consumptionToCreate.guest, obj[i].guest);
                    }
                    done();
                });
            });
        })

        it('should get all consumptions for one person', function (done) {
            var differentConsumptionToCreate = {
                'guest': 'f23ab47c',
                'priceID': 201410231229,
                'drink': 'DrinkName',
                'quantity': 2,
                'time': 201410231328
            };
            var differentConsumptionForGuestToCreate = {
                'guest': 'f23ab47d',
                'priceID': 201410231230,
                'drink': 'DrinkName',
                'quantity': 2,
                'time': 201410231328
            };
            consumptionInterface.addConsumption(consumptionToCreate.guest, consumptionToCreate.priceID, consumptionToCreate.drink, consumptionToCreate.quantity, consumptionToCreate.time, function cb() {
                consumptionInterface.addConsumption(differentConsumptionToCreate.guest, differentConsumptionToCreate.priceID, differentConsumptionToCreate.drink, differentConsumptionToCreate.quantity,
                    differentConsumptionToCreate.time, function cb() {
                        consumptionInterface.addConsumption(differentConsumptionForGuestToCreate.guest, differentConsumptionForGuestToCreate.priceID, differentConsumptionForGuestToCreate.drink,
                            differentConsumptionForGuestToCreate.quantity, differentConsumptionForGuestToCreate.time, function cb() {
                                consumptionInterface.getConsumptionForGuest(consumptionToCreate.guest, function error(err) {}, function cb(obj) {
                                    assert.equal(consumptionToCreate.guest, obj[consumptionToCreate.priceID].guest);
                                    assert.equal(differentConsumptionToCreate.guest, obj[differentConsumptionToCreate.priceID].guest);
                                    assert.equal(obj[differentConsumptionForGuestToCreate.priceID], undefined);
                                    done();
                                });
                            });
                    });
            });
        })

        it('should return all consumption entries', function (done) {
            var differentConsumptionToCreate = {
                'guest': 'f23ab47c',
                'priceID': 201410231229,
                'drink': 'DrinkName',
                'quantity': 2,
                'time': 201410231328
            };
            var differentConsumptionForGuestToCreate = {
                'guest': 'f23ab47d',
                'priceID': 201410231230,
                'drink': 'DrinkName',
                'quantity': 2,
                'time': 201410231328
            };
            consumptionInterface.addConsumption(consumptionToCreate.guest, consumptionToCreate.priceID, consumptionToCreate.drink, consumptionToCreate.quantity, consumptionToCreate.time, function cb() {
                consumptionInterface.addConsumption(differentConsumptionToCreate.guest, differentConsumptionToCreate.priceID, differentConsumptionToCreate.drink, differentConsumptionToCreate.quantity,
                    differentConsumptionToCreate.time, function cb() {
                        consumptionInterface.addConsumption(differentConsumptionForGuestToCreate.guest, differentConsumptionForGuestToCreate.priceID, differentConsumptionForGuestToCreate.drink,
                            differentConsumptionForGuestToCreate.quantity, differentConsumptionForGuestToCreate.time, function cb() {
                                consumptionInterface.getAllConsumptionEntries(function error(err) {}, function cb(obj) {
                                    var length = 0;
                                    for (i in obj) {
                                        length++;
                                    }
                                    assert.equal(length, 3);

                                    done();
                                });
                            });
                    });
            });
        })
    })

    describe('Price History Interface', function () {
        var priceHistoryToCreate = {
            'time': 201410231228,
            'drinks': [{
                'name': 'Name',
                'price': 2.00
            }, {
                'name': 'DifferentDrink',
                'price': 3.00
            }]
        };

        afterEach(function (done) {
            priceHistoryInterface.deleteAllPriceHistoryEntries(function error(err) {}, function cb(obj) {
                done();
            });
        })

        it('should add a priceHistory to database', function (done) {
            priceHistoryInterface.addPriceHistory(priceHistoryToCreate, function cb() {
                done();
            });
        })

        it('should get full priceHistory', function (done) {
            var differentPriceHistoryToCreate = {
                'time': 201410231229,
                'drinks': [{
                    'name': 'Name',
                    'price': 2.50
                }, {
                    'name': 'DifferentDrink',
                    'price': 3.50
                }]
            };
            priceHistoryInterface.addPriceHistory(priceHistoryToCreate, function cb() {
                priceHistoryInterface.addPriceHistory(differentPriceHistoryToCreate, function cb() {
                    priceHistoryInterface.getPriceHistory(function error(err) {}, function cb(obj) {
                        var length = 0;
                        for (var i in obj) {
                            length++;
                        }
                        assert.equal(length, 2);
                        done();
                    });
                });
            });
        })
    })
})