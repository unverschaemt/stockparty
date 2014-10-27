
var iddService = require('../services/iddService.js');
var configUpdateService = require('../services/configUpdateService.js');
var config = require('../config.js');
var m = module.exports = {};

m.use = function (socket) {
    // client specific methods

    // Add event listeners

    // required Services
    iddService.use(socket);
    configUpdateService.use(socket);

    // Initial Data Push
};
