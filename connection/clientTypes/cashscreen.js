var config = require('../config.js');
var configfunctions = require('../configfunctions.js');

var m = module.exports = {};

m.use = function (socket) {
    // client specific methods
    socket.sendCashScreen = function(data){
        socket.emit('cashscreendata', {
            'data': data
        });
    }

    // Add event listeners
    socket.on('setnetworkconfig', function (data) {
        configfunctions.setConfig(data.config);
    });

    // required Services
    configUpdateService.use(socket);


    // Initial Data Push
};
