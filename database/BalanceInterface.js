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

saveBalance = function (data, cb) {
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

m.deleteBalanceForGuest = function(guest, cb) {
  Balance.find({
      guest: guest
  }, function (err, guests) {
      if (err) {
          cb(true);
      } else {
        var c = 0;
        for(var i in guests){
          c++;
          guests[i].remove(function(){
            c--;
            if(c == 0){
              cb(true);
            }
          });
        }
        if(c == 0){
          cb(true);
        }
      }
  });
};

m.deleteAllBalanceEntries = function (error, cb) {
    Balance.find({
    }, function (err, balances) {
        if (err) {
            error(err);
        } else {
            var c = 0;
            for(var i in balances){
                var balance = balances[i];
                if (balance) {
                    balance.remove(function () {
                        c++;
                        if(balance.length == c){
                            cb(c+' from '+balances.length+' deleted good!');
                        }
                    });
                }
            }
            if(balances.length < 1){
                cb(c+' from '+balances.length+' deleted good!');
            }
        }
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
              if(guests[i].balance){
                total += guests[i].balance;
              }
            }
            cb(total);
        }
    });
};
