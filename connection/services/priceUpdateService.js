var config = require('../config.js');
var configfunctions = require('../configfunctions.js');
var drinkInterface = require('../../DrinkInterface.js');
var priceHistoryInterface = require('../../database/PriceHistoryInterface.js');
//var buy = require('buy.js');

var m = module.exports = {};

// NOTE: Services in this module:
// iddplugin: event => expected: {'hid': 'Hardware-ID'}
// iddremove: event => expected: {'hid': 'Hardware-ID'}
// iddscan: event => expected: {'hid': 'Hardware-ID','idk':'scanned rfid key (IDentificationKey)'}

m.use = function (socket) {
    socket.priceUpdate = function (all, entry) {
        if (all) {
            priceHistoryInterface.getPriceHistory(function (err) {
                console.error('ERROR: Failed to load price Data! ERR: '+JSON.stringify(err)+''.red);
            }, function (data) {
                 socket.emit('allpricedata', {
                    'data': data
                });
            });
        } else {
            if(!entry){
            drinkInterface.getPriceEntry(function (err) {
                console.error('ERROR: Failed to get price Entry! ERR: '+JSON.stringify(err)+''.red);
            }, function (priceEntry) {
                 socket.emit('priceupdate', {
                    'priceEntry': priceEntry
                });
            });
            } else {
                socket.emit('priceupdate', {
                    'priceEntry': entry
                });
            }
        }
    };
    // Initial Data Push
    socket.priceUpdate(true);
}
