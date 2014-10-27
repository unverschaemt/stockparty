var config = require('./config.js');
var configfunctions = require('./configfunctions.js');
var c = {};
c.adminpanel = require('./clientTypes/adminpanel.js');
c.cashpanel = require('./clientTypes/cashpanel.js');
c.connector = require('./clientTypes/connector.js');
c.monitor = require('./clientTypes/monitor.js');

var m = module.exports = {};

m.use = function (socket) {

    //Initial onLogin Create View
    socket.emit('view', {
        'view': 'list',
        'data': configfunctions.makeClientList()
    });
    socket.sendError = function (msg) {
        socket.emit('err', {
            'msg': msg
        });
    };

    socket.on('clientchoice', function (data) {
        if (!(data.clientid && socket && config.data.clients[data.clientid])) {
            return socket.sendError('Could not register');
        }
        socket.clientid = data.clientid;
        if (c && c[config.data.clients[data.clientid].type]) {
            if (configfunctions.addClient(socket)) {
                c[config.data.clients[data.clientid].type].use(socket);
            }
        } else {
            return socket.sendError('No Client Type detected!');
        }
    });

    socket.on('disconnect', function (data) {

    });

};
