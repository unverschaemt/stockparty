var config = require('../config.js');
var configfunctions = require('../configfunctions.js');
var broadcasts = require('../broadcasts.js');

var m = module.exports = {};

// NOTE: Services in this module:
// iddplugin: event => expected: {'hid': 'Hardware-ID'}
// iddremove: event => expected: {'hid': 'Hardware-ID'}
// iddscan: event => expected: {'hid': 'Hardware-ID','idk':'scanned rfid key (IDentificationKey)'}
// idderror: event => expected: {Some Object to print}

m.use = function (socket) {

    socket.on('iddplugin', function (data) {
        console.log('iddplugin', data);
        var client = config.data.clients[socket.clientid];
        var found = false;
        var deviceId = "";
        for (var did in config.data.devices) {
            if (config.data.devices[did].type === 'idd' && config.data.devices[did].hid === data.hid) {
                found = true;
                config.runtime[did].client = socket.clientid;
                return broadcasts.get('updateConfig')(['devices', did, 'client']);
            }
        }
        if (!found) {
            console.log("New Device");
            configfunctions.createDevice('idd', 'IDD Device', data.hid, socket.clientid);
        }
    });

    socket.on('iddremove', function (data) {
        console.log('iddremove', data);
        var client = config.data.clients[socket.clientid];
        for (var did in config.data.devices) {
            if (config.data.devices[did].type === 'idd' && config.data.devices[did].hid === data.hid) {
                config.runtime[did].client = '';
                return broadcasts.get('updateConfig')(['devices', did, 'client']);
            }
        }
    });

    socket.on('iddscan', function (data) {
        console.log('iddscan', data);
        var client = config.data.clients[socket.clientid];
        for (var did in config.data.devices) {
            if (config.data.devices[did].type === 'idd' && config.data.devices[did].hid === data.hid) {
                for (var cid in config.data.clients) {
                    if ((config.data.clients[cid].type === 'cashpanel' && config.data.clients[cid].idd === did) || config.data.clients[cid].type === 'adminpanel') {
                        for (var k in config.runtime[cid].sockets) {
                            config.runtime[cid].sockets[k].iddscan({
                                'hid': data.hid,
                                'did': did,
                                'idk': data.idk
                            });
                        }
                    }
                }
            }
        }
    });

    socket.on('idderror', function (data) {
        console.log('idderror', data);
    });

    socket.on('disconnect', function (data) {
        var client = config.data.clients[socket.clientid];
        for (var did in config.data.devices) {
            if (config.data.devices[did].type === 'idd' && config.runtime[did].client === socket.clientid) {
                config.runtime[did].client = '';
                return broadcasts.get('updateConfig')(['devices', did, 'client']);
            }
        }
    });
};
