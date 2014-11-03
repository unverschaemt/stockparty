
var connection = require('./connection.js');
var userInterface = require('../database/UserInterface.js');
var md5 = require('MD5');
var m = module.exports = {};

m.acceptLogin = function(socket){
    connection.use(socket);
};

m.loginFail = function(socket, info){
    socket.emit('loginfail', {'info':info});
};

m.use = function(socket){

    socket.on('login', function(data, fn){
        m.acceptLogin(socket);
        /*userInterface.getUser(data.username, function(err){
            fn(err);
            m.loginFail(socket, err);
        }, function(user){
            if(user.password === md5(data.password)){
               m.acceptLogin(socket);
            } else {
                fn();
                m.loginFail(socket, 'username invalid');
            }
        });*/
    });

};
