var User = require('./models/User');
var config = require('../connection/config.js');
var md5 = require('MD5');

var m = module.exports = {};

m.addUser = function (data, cb) {
    var user = new User({
        userName: data.userName,
        password: data.password,
        name: data.name,
        role: data.role
    });
    user.save(function (err, user) {
        if (err) return console.error(err);
        console.log("saved user");
        cb(true);
    });
};

m.deleteUser = function (userName, cb) {
    User.findOne({
        userName: userName
    }, function (err, user) {
        if (err) {
            cb(err);
        } else {
            if (!user) {
                cb(false);
            } else {
                user.remove(function () {
                    cb(true);
                });
            }
        }
    });
};

m.getUser = function (userName, error, cb) {
    User.findOne({
        userName: userName
    }, function (err, user) {
        if (err) {
            error(err);
        } else {
            if (user == null) {
                error('User not found!');
            } else {
                cb(user);
            }
        }
    });
};

m.setUserInfo = function (data, cb) {
    User.findOne({
        userName: data.userName
    }, function (err, user) {
        if (err) {
            cb(err);
        } else {
            if (!user) {
                cb(true);
            } else {
                for (var k in data) {
                    if (k != "_id") {
                        if (k == "password") {
                            user[k] = md5(data[k]);
                            console.log("set user " + k);
                        } else {
                            user[k] = data[k];
                            console.log("set user " + k + " " + JSON.stringify(user[k]));
                        }
                    }
                }
                user.save(function (err, user) {
                    if (err) {
                        cb(err);
                    } else {
                        cb(false, user._id);
                    }
                });
            }
        }
    });
};

m.init = function (error) {
    User.findOne({
        userName: 'admin'
    }, function (err, user) {
        if (err) {
            error(err);
        } else {
            if (!user) {
                var admin = new User({
                    userName: 'admin',
                    password: md5('admin'),
                    name: 'Administrator',
                    //TODO: correct role
                    role: {}
                });
                admin.save(function (err, user) {
                    if (err) return console.error(err);
                    console.log("saved admin");
                });
            }
        }
    });
};