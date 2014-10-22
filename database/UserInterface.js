var User = require('./model/user');
var q = require('q');

var m = module.exports = {};

m.addUser = function (userName, password, name, role) {
    var user = new User({
        userName: userName,
        password: password,
        name: name,
        role: role
    });
    user.save(function (err, user) {
        if (err) return console.error(err);
        console.log("saved");
    });
};

m.deleteUser = function (id) {
    var deferred = q.defer();
    User.findOne({
        _id: id
    }, '_id name', function (err, user) {
        if (err) {
            deferred.reject(err);
        } else {
            if (!user) {
                deferred.reject(true);
            } else {
                user.remove(function () {
                    deferred.resolve(true);
                });
            }
        }
    });
    return deferred.promise;
};

m.getUser = function (id) {
    var deferred = q.defer();
    User.findOne({
        _id: id
    }, '_id data metadata', function (err, user) {
        if (err) {
            deferred.reject(err);
        } else {
            if (!user) {
                deferred.reject(true);
            } else {
                if (user.data && user.metadata) {
                    deferred.resolve({
                        "buffer": user.data,
                        "metadata": user.metadata
                    });
                } else {
                    deferred.reject(true);
                }
            }
        }
    });
    return deferred.promise;
};

m.setUserInfo = function (id, data) {
    var deferred = q.defer();
    User.findOne({
        _id: id
    }, function (err, user) {
        if (err) {
            deferred.reject(err);
        } else {
            if (!user) {
                deferred.reject(true);
            } else {
                for (var k in data) {
                    if(k != "_id"){
                        user[k] = data[k];
                        console.log("set user "+k+" "+JSON.stringify(user[k]));
                    }
                }
                user.save(function (err, user) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(user._id);
                    }
                });
            }
        }
    });
    return deferred.promise;
};