var Guest = require('./models/Guest');

var m = module.exports = {};

m.addGuest = function (idk, balance, name, birthDay) {
    var guest = new Guest({
        idk: idk,
        balance: balance,
        name: name,
        birthDay: birthDay
    });
    guest.save(function (err, guest) {
        if (err) return console.error(err);
        console.log("saved");
    });
};

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

m.deleteGuest = function (id, error, cb) {
    Guest.findOne({
        _id: id
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

m.setGuestBalance = function (id, money, error, cb) {
    Guest.findOne({
        _id: id
    }, function (err, guest) {
        if (err) {
            error(err);
        } else {
            if (!guest) {
                cb(true);
            } else {
                var newBalance = guest["balance"];
                newBalance += money;
                console.log("set new balance for " + guest.idk + ", new balance: " + newBalance);
                guest.save(function (err, guest) {
                    if (err) {
                        error(err);
                    } else {
                        cb(guest._id);
                    }
                });
            }
        }
    });
};