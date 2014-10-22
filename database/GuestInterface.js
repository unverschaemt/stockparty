var Guest = require('./models/Guest');

var m = module.exports = {};

m.addGuest = function (idk, balance, name, birthDate, error) {
    if(idk){
        Guest.findOne({
            idk: idk
        }, function (err, guest) {
            if(!guest){
                newGuest(idk, balance, name, birthDate);
            }else{
                error("Identification for this user already exists");
            }
        });
    }else{
        newGuest(idk, balance, name, birthDate);
    }
};

newGuest = function(idk, balance, name, birthDate){
    var guest = new Guest({
                idk: idk,
                balance: balance,
                name: name,
                birthDate: birthDate
            });
            guest.save(function (err, guest) {
                if (err) return console.error(err);
                    console.log("saved");
                });
}
    

m.deleteAllGuests = function (error, cb) {
    Guest.find({
    }, function (err, guests) {
        if (err) {
            error(err);
        } else {
            var c = 0;
            for(var i in guests){
                var guest = guests[i];
                if (guest) {
                    guest.remove(function () {
                        c++;
                        if(guests.length == c){
                            cb(c+" from "+guests.length+" deleted good!");
                        }
                    });
                }
            }
            if(guests.length < 1){
                cb(c+" from "+guests.length+" deleted good!");
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
            error(err);
        } else {
            if (!guest) {
                cb(true);
            } else {
                var temp = JSON.parse(JSON.stringify(guest));
                cb(temp);
            }
        }
    });
};

m.setGuestBalance = function (idk, money, error, cb) {
    Guest.findOne({
        idk: idk
    }, function (err, guest) {
        if (err) {
            error(err);
        } else {
            if (!guest) {
                cb(true);
            } else {
                var newBalance = guest["balance"];
                newBalance += money;
                guest["balance"] = newBalance;
                guest.save(function (err, guest) {
                    if (err) {
                        error(err);
                    } else {
                        console.log("set new balance for " + guest.idk + ", new balance: " + newBalance);
                        cb(guest.idk); 
                    }
                });
            }
        }
    });
};