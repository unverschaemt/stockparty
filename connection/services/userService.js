var config = require('../config.js');
var configfunctions = require('../configfunctions.js');
var userInterface = require('../../database/UserInterface.js');

var m = module.exports = {};

// NOTE: Services in this module:
// adduser: event => expected: {some object} => see userInterface.addUser
// deleteuser: event => expected: {some object} => see userInterface.deleteUser
// setuserinfo: event => expected: {some object} => see userInterface.setUserInfo

m.use = function (socket) {
    socket.on('adduser', function(data, fn){
        userInterface.addUser(data, fn);
    });
    socket.on('deleteuser', function(data, fn){
        userInterface.deleteUser(data, fn);
    });
    socket.on('setuserinfo', function(data, fn){
        userInterface.setUserInfo(data, fn);
    });
}
