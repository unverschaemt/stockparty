var Balance = require('./models/Balance');
var guestInterface = require('./GuestInterface');

var m = module.exports = {};

m.addBalance = function (data, cb) {
    if (data.balance < 0) {
        guestInterface.getBalanceOfGuest(data.guest, function callBack(total) {
            if (total - data.balance < 0) {
                cb(false);
            } else {
                saveBalance(data, cb);
            }
        });
    } else {
        saveBalance(data, cb);
    }
};

m.saveBalance = function (data, cb) {
    var balance = new Balance({
        guest: data.guest,
        time: new Date().getTime(),
        balance: data.balance
    });
    balance.save(function (err, balance) {
        if (err) return cb(false);
        console.log('saved balance');
        cb(true);
    });
};

m.getAllEntriesForGuest = function (guest, error, cb) {
    Balance.find({
        guest: guest
    }, function (err, guests) {
        if (err) {
            error(err);
        } else {
            var ex = {};
            for (var i in guests) {
                ex[guests[i].time] = guests[i];
            }
            var temp = JSON.parse(JSON.stringify(ex));
            cb(temp);
        }
    });
};

m.getTotalForGuest = function (guest, error, cb) {
    Balance.find({
        guest: guest
    }, function (err, guests) {
        if (err) {
            error(err);
        } else {
            var total = 0;
            for (var i in guests) {
                total += guests[i].balance;
            }
            cb(total);
        }
    });
};
