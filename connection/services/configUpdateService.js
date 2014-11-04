
var configfunctions = require('../configfunctions.js');
var config = require('../config.js');
var broadcasts = require('../broadcasts.js');

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
};

broadcasts.add('updateConfig', function (arr) {
    configfunctions.saveConfig();
    var runtime = configfunctions.getSerializedRuntime();
    for (var cid in config.data.clients) {
        if (config.runtime[cid] && config.runtime[cid].sockets && config.runtime[cid].sockets.length > 0) {
            for (var k in config.runtime[cid].sockets) {
                if (config.runtime[cid].sockets[k].updateConfig) {
                    config.runtime[cid].sockets[k].updateConfig(config.data, runtime, arr);
                }
            }
        }
    }
});
