var Guest = require('./models/Guest');
var q = require('q');

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

m.deleteAllGuests = function () {
    var deferred = q.defer();
    Guest.find({
    }, function (err, guests) {
        if (err) {
            deferred.reject(err);
        } else {
            var c = 0;
            for(var i in guests){
                var guest = guests[i];
                if (guest) {
                    guest.remove(function () {
                        c++;
                        if(guests.length == c){
                            deferred.resolve(c+" from "+guests.length+" deleted good!");
                        }
                    });
                }
            }
            if(guests.length < 1){
                deferred.resolve(c+" from "+guests.length+" deleted good!");
            }
        }
    });
    return deferred.promise;
};

m.deleteGuest = function (id) {
    var deferred = q.defer();
    Guest.findOne({
        _id: id
    }, '_id name', function (err, guest) {
        if (err) {
            deferred.reject(err);
        } else {
            if (!guest) {
                deferred.reject(true);
            } else {
                guest.remove(function () {
                    deferred.resolve(true);
                });
            }
        }
    });
    return deferred.promise;
};

m.getGuest = function (idk) {
    var deferred = q.defer();
    Guest.findOne({
        idk: idk
    }, function (err, guest) {
        if (err) {
            deferred.reject(err);
        } else {
            if (!guest) {
                deferred.reject(true);
            } else {
                var temp = JSON.parse(JSON.stringify(guest));
                deferred.resolve(temp);
            }
        }
    });
    return deferred.promise;
};

m.setGuestBalance = function (id, money) {
    var deferred = q.defer();
    Guest.findOne({
        _id: id
    }, function (err, guest) {
        if (err) {
            deferred.reject(err);
        } else {
            if (!guest) {
                deferred.reject(true);
            } else {
                var newBalance = guest["balance"];
                newBalance += money;
                console.log("set new balance for " + guest.idk + ", new balance: " + newBalance);
                guest.save(function (err, guest) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(guest._id);
                    }
                });
            }
        }
    });
    return deferred.promise;
};