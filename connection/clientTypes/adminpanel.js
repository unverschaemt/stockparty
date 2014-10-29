var config = require('../config.js');
var configfunctions = require('../configfunctions.js');
var configUpdateService = require('../services/configUpdateService.js');
var drinkInterface = require('../../DrinkInterface.js');

var m = module.exports = {};

m.use = function (socket) {
    // client specific methods
    socket.iddscan = function (obj) {
        socket.emit('iddscan', {
            'data': obj
        });
    };

    // Add event listeners
    socket.on('setnetworkconfig', function (data) {
        configfunctions.setConfig(data.config);
    });
    socket.on('save', function () {
        configfunctions.saveConfig();
    });
    socket.on('adddrink', function (data, fn) {
        drinkInterface.addDrink(data, fn);
    });

    socket.on('disconnect', function (data) {
        for (var i in config.data.clients) {
            if (config.data.clients[i].type === 'adminpanel') {
                var mycl = i;
                break;
            }
        }
        if (mycl && config.runtime[mycl] && config.runtime[mycl].sockets && config.runtime[mycl].sockets.length === 0) {
            config.data.global.configmode = false;
            configfunctions.updateConfigAll(['global', 'configmode']);
        }
    });

    // required Services
    configUpdateService.use(socket);


    // Initial Data Push
};
