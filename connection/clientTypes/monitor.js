
var priceUpdateService = require('../services/priceUpdateService.js');
var configUpdateService = require('../services/configUpdateService.js');
var drinkUpdateService = require('../services/drinkUpdateService.js');

var config = require('../config.js');
var m = module.exports = {};

m.use = function (socket) {
    // client specific methods

    // Add event listeners

    // required Services
    priceUpdateService.use(socket);
    configUpdateService.use(socket);
    drinkUpdateService.use(socket);

    // Initial Data Push
};
