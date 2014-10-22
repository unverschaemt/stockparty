var Guest = require('./model/guest');
var q = require('q');

var m = module.exports = {};

m.addGuest = function (idk, name, birthDay) {
    var guest = new Guest({
        idk: idk,
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
    Guest.find(function (err, guests) {
        if (err) {
            deferred.reject(err);
        } else {
            if (!guests) {
                deferred.reject(true);
            } else {
                guests.remove(function () {
                    deferred.resolve(true);
                });
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

m.getGuest = function (id) {
    var deferred = q.defer();
    Guest.findOne({
        _id: id
    }, '_id data metadata', function (err, guest) {
        if (err) {
            deferred.reject(err);
        } else {
            if (!guest) {
                deferred.reject(true);
            } else {
                if (guest.data && guest.metadata) {
                    deferred.resolve({
                        "buffer": guest.data,
                        "metadata": guest.metadata
                    });
                } else {
                    deferred.reject(true);
                }
            }
        }
    });
    return deferred.promise;
};

m.setGuestInfo = function (id, data) {
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
                for (var k in data) {
                    if(k != "_id"){
                        guest[k] = data[k];
                        console.log("set guest "+k+" "+JSON.stringify(guest[k]));
                    }
                }
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