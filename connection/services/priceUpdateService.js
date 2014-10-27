var config = require('../config.js');
var configfunctions = require('../configfunctions.js');
//var buy = require('buy.js');

var m = module.exports = {};

// NOTE: Services in this module:
// iddplugin: event => expected: {'hid': 'Hardware-ID'}
// iddremove: event => expected: {'hid': 'Hardware-ID'}
// iddscan: event => expected: {'hid': 'Hardware-ID','idk':'scanned rfid key (IDentificationKey)'}

m.use = function (socket) {
    socket.on('monte', function (data, fn) {
        if (config.data.clients[socket.clientid].type === 'cashpanel') {
            //buy.executeBuy(data, fn, fn);
        }
    });
}
