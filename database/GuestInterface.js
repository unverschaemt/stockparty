var Guest = require('./models/Guest');
var balanceInterface = require('./BalanceInterface');
var consumptionInterface = require('./ConsumptionInterface');
var priceHistoryInterface = require('./PriceHistoryInterface');

var m = module.exports = {};

m.addGuest = function (idk, name, birthDate, error, cb) {
    if (idk) {
        Guest.findOne({
            idk: idk
        }, function (err, guest) {
            if (!guest) {
                newGuest(idk, name, birthDate, cb);
            } else {
                error('Identification for this user already exists');
            }
        });
    } else {
        newGuest(idk, name, birthDate, cb);
    }
};

newGuest = function (idk, name, birthDate, cb) {
    var guest = new Guest({
        idk: idk,
        name: name,
        birthDate: birthDate
    });
    guest.save(function (err, guest) {
        if (err) return console.error(err);
        console.log('saved guest');
        cb(true);
    });
}

m.deleteAllGuests = function (error, cb) {
    Guest.find({}, function (err, guests) {
        if (err) {
            error(err);
        } else {
            var c = 0;
            for (var i in guests) {
                var guest = guests[i];
                if (guest) {
                    guest.remove(function () {
                        c++;
                        if (guests.length == c) {
                            cb(c + ' from ' + guests.length + ' deleted good!');
                        }
                    });
                }
            }
            if (guests.length < 1) {
                cb(c + ' from ' + guests.length + ' deleted good!');
            }
        }
    });
};

m.deleteGuest = function (idk, error, cb) {
    Guest.findOne({
        idk: idk
    }, function (err, guest) {
        if (err) {
            error(err);
        } else {
            if (!guest) {
                cb(true);
            } else {
                guest.remove(function () {
                    cb(true);
                });
            }
        }
    });
};

m.getGuest = function (idk, error, cb) {
    Guest.findOne({
        idk: idk
    }, function (err, guest) {
        if (err) {
            var guest = {
                'idk': idk,
                'name': '',
                'birthDate': 0
            };
            m.addGuest(idk, '', 0, function (err) {
                error(err)
            }, function (obj) {
                cb(guest);
            });
        } else {
            if (!guest) {
                var guest = {
                    'idk': idk,
                    'name': '',
                    'birthDate': 0
                };
                m.addGuest(idk, '', 0, function (err) {
                    error(err)
                }, function (obj) {
                    cb(guest);
                });
            } else {
                var temp = JSON.parse(JSON.stringify(guest));
                getBalanceOfGuest(idk, function callBack(balance) {
                    temp.balance = balance;
                    cb(temp);
                });
            }
        }
    });
};

getBalanceOfGuest = function (guestID, callBack) {
    var totalBalance = 0;
    balanceInterface.getTotalForGuest(guestID, function error(err) {
        console.log(err)
    }, function cb(balance) {
        totalBalance = balance;
        consumptionInterface.getConsumptionForGuest(guestID, function error(err) {
            console.log(err)
        }, function cb(consumptionEntries) {
            var empty = true;
            var c = 0;
            for (var i in consumptionEntries) {
                empty = false;
                c++;
                priceHistoryInterface.getPricesForID(consumptionEntries[i].priceID, function error(err) {
                    console.log(err);
                    c--;
                }, function cb(priceEntry) {
                    c--;
                    totalBalance -= priceEntry.drinks[consumptionEntries[i].drink].price * consumptionEntries[i].quantity;
                    if (c === 0) {
                        callBack(totalBalance);
                    }
                });
            }
            if (empty) {
                callBack(totalBalance);
            }
        });
    });
};