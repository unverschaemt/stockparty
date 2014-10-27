var config = require('../config.js');
var configfunctions = require('../configfunctions.js');

var m = module.exports = {};

m.use = function (socket) {
    // Methods
    socket.updateConfig = function (conf, run, arr) {
        var arr = arr || false;
        socket.emit('configupdate', {
            'config': conf,
            'runtime': run,
            'arr': arr
        });
    };
    // Initial Data Push
    socket.updateConfig(config.data, configfunctions.getSerializedRuntime());
}
