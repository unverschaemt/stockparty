var m = module.exports = {};
var colors = require('colors');
var config = require('./config.js');

// Deprecated START !!!!!!!!!!!!!!!
m.onNewPriceEntry = function (priceEntry) {
    console.log('WARNING: onNewPriceEntry in triggerfunctions is deprecated! Please use the broadcast method in priceUpdateService.js'.yellow);
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
// Deprecated END !!!!!!!!!!!!
