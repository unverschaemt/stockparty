var config = require('../config.js');
var configfunctions = require('../configfunctions.js');
var drinkInterface = require('../../DrinkInterface.js');
var priceHistoryInterface = require('../../database/PriceHistoryInterface.js');

var m = module.exports = {};

// NOTE: Services in this module:
// priceUpdate: method => expected: {'all': boolean, 'entry': (Preread Priceentry)}

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

m.priceUpdateBroadcast = function (priceEntry) {
    for (var cid in config.data.clients) {
        if (config.runtime[cid] && config.runtime[cid].sockets && config.runtime[cid].sockets.length > 0) {
            for (var k in config.runtime[cid].sockets) {
                if (config.runtime[cid].sockets[k].priceUpdate) {
                    config.runtime[cid].sockets[k].priceUpdate(false, priceEntry);
                }
            }
        }
    }
};
