var iddService = require('../services/iddService.js');
var configUpdateService = require('../services/configUpdateService.js');
var priceUpdateService = require('../services/priceUpdateService.js');
var drinkUpdateService = require('../services/drinkUpdateService.js');
var config = require('../config.js');
var drinkInterface = require('../../DrinkInterface.js');
var balanceInterface = require('../../database/BalanceInterface.js');
var guestInterface = require('../../database/GuestInterface.js');
var colors = require('colors');
var m = module.exports = {};

m.use = function (socket) {
    // client specific methods

    socket.iddscan = function (obj) {
        drinkInterface.getPriceEntry(function (err) {
            console.error('ERROR: Failed to get price Entry! ERR: '+JSON.stringify(err)+''.red);
        }, function (priceEntry) {
            guestInterface.getGuest(obj.idk, function (err) {
                console.error('ERROR: Failed to load Guest! ERR: '+JSON.stringify(err)+''.red);
            }, function (guest) {
                socket.emit('neworder', {
                    'priceEntry': priceEntry,
                    'guest': guest
                });
            });
        });
    };

    // Add event listeners
    socket.on('cashpanelbuy', function (data, fn) {
        if (config.data.clients[socket.clientid].type === 'cashpanel') {
            drinkInterface.buyDrinks(data, fn);
        }
    });
    socket.on('addbalance', function (data, fn) {
        if (config.data.clients[socket.clientid].type === 'cashpanel') {
            balanceInterface.addBalance(data, fn);
        }
    });
    socket.on('cashscreen', function (data) {
        if (config.data.clients[socket.clientid].type === 'cashpanel' && config.data.clients[socket.clientid].cashscreen !== '') {
            if (config.runtime[config.data.clients[socket.clientid].cashscreen] && config.runtime[config.data.clients[socket.clientid].cashscreen].sockets) {
                for (k in config.runtime[config.data.clients[socket.clientid].cashscreen].sockets) {
                    if (config.runtime[config.data.clients[socket.clientid].cashscreen].sockets[k].sendCashScreen) {
                        config.runtime[config.data.clients[socket.clientid].cashscreen].sockets[k].sendCashScreen(data);
                    }
                }
            }
        }
    });

    // required Services
    configUpdateService.use(socket);
    iddService.use(socket);
    priceUpdateService.use(socket);
    drinkUpdateService.use(socket);

    // Initial Data Push
};
