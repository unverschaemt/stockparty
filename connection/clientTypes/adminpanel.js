var config = require('../config.js');
var configfunctions = require('../configfunctions.js');
var configUpdateService = require('../services/configUpdateService.js');
var priceCalculator = require('../../PriceCalculator.js');
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
    socket.on('setconfig', function (data) {
        if(data.global.stockcrash !== config.data.global.stockcrash){
            drinkInterface.triggerStockCrash(data.global.stockcrash);
        }
        if(data.global.inverval !== config.data.global.inverval){
            priceCalculator.setRefreshInterval(data.global.inverval);
        }
        if(data.global.running !== config.data.global.running){
            priceCalculator.triggerCalculation(data.global.running);
        }

        configfunctions.setConfig(data);
    });
    socket.on('save', function () {
        configfunctions.saveConfig();
    });
    socket.on('adddrink', function (data, fn) {
        drinkInterface.addDrink(data, fn);
    });
    socket.on('removedrink', function (data, fn) {
        drinkInterface.removeDrink(data.drinkID, fn);
    });
    socket.on('setdrink', function (data, fn) {
        drinkInterface.setDrink(data, fn);
    });
    socket.on('setprice', function (data) {
        drinkInterface.setPrice(data);
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
