var utils = require('../utils.js');
var config = require('./config.js');

var m = module.exports = {};

m.setConfig = function (conf) {
    config.data = conf;
    m.updateConfigAll();
};

m.getSerializedRuntime = function () {
    var out = {};
    for (var i in config.runtime) {
        out[i] = {};
        if(config.runtime[i].sockets){
            out[i].connections = config.runtime[i].sockets.length;
        }
        for(var j in config.runtime[i]){
            if(j !== 'sockets'){
                out[i][j] = config.runtime[i][j];
            }
        }
    }
    return out;
};

m.updateConfigAll = function (arr) {
    var runtime = m.getSerializedRuntime();
    for (var cid in config.data.clients) {
        if (config.runtime[cid] && config.runtime[cid].sockets && config.runtime[cid].sockets.length > 0) {
            for (var k in config.runtime[cid].sockets) {
                if (config.runtime[cid].sockets[k].updateConfig) {
                    config.runtime[cid].sockets[k].updateConfig(config.data, runtime, arr);
                }
            }
        }
    }
};

m.createClient = function (type, name, devices) {
    var devices = (devices && true) || false;
    if (config.data.global.configmode) {
        var cid = '';
        var found = false;
        var i = 0;
        while (!found && i < 1000000) {
            cid = config.data.global.devicenameprefix + utils.numberToString(i, 3);
            if (!config.data.devices[cid]) {
                found = true;
            }
            i++;
        }
        if (!found) {
            console.error('looped to long [createClient] in connection/config.js');
            return false;
        }
        config.data.clients[cid] = new config.client(cid, type, name, devices);
        m.updateConfigAll(['clients', cid]);
        return cid;
    } else {
        return false;
    }
};

m.removeClient = function (cid) {
    if (config.data.global.configmode) {
        if (config.data.clients[cid]) {
            for (var k in config.runtime[cid].sockets) {
                config.runtime[cid].sockets[k].disconnect();
            }
            delete config.data.clients[cid];
            delete config.runtime[cid];
            m.updateConfigAll(['clients', cid]);
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
};

m.createDevice = function (type, name, hid, client) {
    if (config.data.global.configmode) {
        var did = '';
        var found = false;
        var i = 0;
        while (!found && i < 1000000) {
            did = config.data.global.devicenameprefix + utils.numberToString(i, 3);
            if (!config.data.devices[did]) {
                found = true;
            }
            i++;
        }
        if (!found) {
            console.error('looped to long [createDevice] in connection/config.js');
            return false;
        }
        config.data.devices[did] = new config.device(did, type, name, hid, client);
        m.updateConfigAll(['devices', did]);
        return did;
    } else {
        return false;
    }
};

m.removeDevice = function (did) {
    if (config.data.global.configmode) {
        if (config.data.devices[did]) {
            delete config.data.devices[did];
            delete config.runtime[did];
            for (var cid in config.data.clients) {
                if (config.data.clients[cid].idd && config.data.clients[cid].idd === did) {
                    config.data.clients[cid].idd = '';
                }
            }
            m.updateConfigAll(['devices', did]);
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
};

m.addClient = function (socket) {
    if (!config.runtime[socket.clientid].sockets) {
        config.runtime[socket.clientid].sockets = [];
    }
    if (config.runtime[socket.clientid].sockets.length >= config.data.clients[socket.clientid].maxsockets) {
        socket.sendError('Already connected');
        return false;
    }
    config.runtime[socket.clientid].sockets.push(socket);
    socket.on('disconnect', function (data) {
        var index = config.runtime[socket.clientid].sockets.indexOf(socket);
        config.runtime[socket.clientid].sockets.splice(index, 1);
    });
    socket.emit('view', {
        'view': config.data.clients[socket.clientid].view,
        'cid': socket.clientid,
        'cconfig': config.data.clients[socket.clientid]
    });
    return true;
};

m.makeClientList = function(){
    var out = [];
    for(var cid in config.data.clients){
        var client = {};
        if(config.runtime[cid]){
            client.connections = config.runtime[cid].sockets.length;
        } else {
            client.connections = 0;
        }
        client.name = config.data.clients[cid].name;
        client._id = config.data.clients[cid]._id;
        client.maxsockets = config.data.clients[cid].maxsockets;
        client.type = config.data.clients[cid].type
        out.push(client);
    }
    return out;
};
