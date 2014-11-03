var config = require('../config.js');
var configfunctions = require('../configfunctions.js');
var userInterface = require('../../database/UserInterface.js');
//var buy = require('buy.js');

var m = module.exports = {};


m.use = function (socket) {
    socket.on('adduser', function(data, fn){
        userInterface.addUser(data, fn);
    });
    socket.on('removeuser', function(data, fn){
        userInterface.deleteUser(data, fn);
    });
    socket.on('setuser', function(data, fn){
        userInterface.setUserInfo(data, fn);
    });
}
