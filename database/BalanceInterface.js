var Balance = require('./models/Balance');
var guestInterface = require('./GuestInterface');

var m = module.exports = {};

m.addBalance = function (guest, balance, cb) {
    if (balance < 0) {
        guestInterface.getBalanceOfGuest(guest, callBack(total) {
            if (total - balance < 0) {
                cb(false);
            } else {
                saveBalance(guest, balance, cb);
            }
        });
    } else {
        saveBalance(guest, balance, cb);
    }
};

saveBalance = function (guest, balance, cb) {
    var balance = new Balance({
        guest: guest,
        time: new Date().getTime(),
        balance: balance
    });
    balance.save(function (err, balance) {
        if (err) return cb(false);
        console.log('saved balance');
        cb(true);
    });
}

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