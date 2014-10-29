var m = module.exports = {};
var config = require('./config.js');


m.onNewPriceEntry = function (priceEntry) {
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
