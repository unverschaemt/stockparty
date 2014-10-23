var User = require('./models/User');

var m = module.exports = {};

m.addUser = function (userName, password, name, role, cb) {
    var user = new User({
        userName: userName,
        password: password,
        name: name,
        role: role
    });
    user.save(function (err, user) {
        if (err) return console.error(err);
        console.log("saved");
        cb(true);
    });
};

m.deleteUser = function (userName, error, cb) {
    User.findOne({
        userName: userName
    }, function (err, user) {
        if (err) {
            error(err);
        } else {
            if (!user) {
                cb(true);
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
            cb(user);
        }
    });
};

m.setUserInfo = function (userName, data, error, cb) {
    User.findOne({
        userName: userName
    }, function (err, user) {
        if (err) {
            error(err);
        } else {
            if (!user) {
                cb(true);
            } else {
                for (var k in data) {
                    if(k != "_id"){
                        user[k] = data[k];
                        console.log("set user "+k+" "+JSON.stringify(user[k]));
                    }
                }
                user.save(function (err, user) {
                    if (err) {
                        error(err);
                    } else {
                        cb(user._id);
                    }
                });
            }
        }
    });
};