var config = require('../config.js');
var configfunctions = require('../configfunctions.js');
var drinkInterface = require('../../DrinkInterface.js');
var broadcasts = require('../broadcasts.js');
var m = module.exports = {};

// NOTE: Services in this module:
// drinkUpdate: method => expected: (nothing)

m.use = function (socket) {
    // Methods
    socket.drinkUpdate = function (drinks) {
        if (drinks) {
            socket.emit('drinkupdate', {
                'drinks': drinks
            });
        } else {
            drinkInterface.getAllDrinks(function (err) {
                console.error('ERROR: Failed to load drinks!');
            }, function (drinks) {
                socket.emit('drinkupdate', {
                    'drinks': drinks
                });
            });
        }
    };
    // Initial Data Push
    socket.drinkUpdate();
}

broadcasts.add('drinkUpdate', function (drinks) {
    for (var cid in config.data.clients) {
        if (config.runtime[cid] && config.runtime[cid].sockets && config.runtime[cid].sockets.length > 0) {
            for (var k in config.runtime[cid].sockets) {
                if (config.runtime[cid].sockets[k].drinkUpdate) {
                    config.runtime[cid].sockets[k].drinkUpdate(drinks);
                }
            }
        }
    }
});
