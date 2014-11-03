var config = require('../config.js');
var configfunctions = require('../configfunctions.js');
var configUpdateService = require('../services/configUpdateService.js');
var priceUpdateService = require('../services/priceUpdateService.js');
var drinkUpdateService = require('../services/drinkUpdateService.js');
var userService = require('../services/userService.js');
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
        if(!(data)) return console.error("Invalid input parameter in adminpanel/setconfig!");
        if(data.global.stockcrash !== config.data.global.stockcrash){
            drinkInterface.triggerStockCrash(data.global.stockcrash);
        }
        if(data.global.interval !== config.data.global.interval){
            priceCalculator.setRefreshInterval(data.global.interval);
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
        if(!(data && fn)) return console.error("Invalid input parameters in adminpanel/adddrink!");
        drinkInterface.addDrink(data, fn);
    });
    socket.on('removedrink', function (data, fn) {
        if(!(data && fn)) return console.error("Invalid input parameters in adminpanel/removedrink!");
        drinkInterface.removeDrink(data.drinkID, fn);
    });
    socket.on('setdrink', function (data, fn) {
        if(!(data && fn)) return console.error("Invalid input parameters in adminpanel/setdrink!");
        drinkInterface.setDrink(data, fn);
    });
    socket.on('setprice', function (data) {
        if(!(data)) return console.error("Invalid input parameter in adminpanel/setprice!");
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
    drinkUpdateService.use(socket);
    priceUpdateService.use(socket);
    userService.use(socket);


    // Initial Data Push
};
