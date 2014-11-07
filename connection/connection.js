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
    socket.emitListView = function(){
        socket.emit('view', {
            'view': 'list',
            'data': configfunctions.makeClientList()
        });
    }
    socket.sendError = function (msg) {
        socket.emit('err', {
            'msg': msg
        });
    };

    socket.on('clientchoice', function (data, error) {
        if (!(data.clientid && socket && config.data.clients[data.clientid])) {
            error('Could not register');
            return socket.emitListView('Could not register');
        }
        socket.clientid = data.clientid;
        if (c && c[config.data.clients[data.clientid].type]) {
            if (configfunctions.addClient(socket, error)) {
                c[config.data.clients[data.clientid].type].use(socket);
            }
        } else {
            error('No Client Type detected!');
            return socket.emitListView('No Client Type detected!');
        }
    });

    socket.on('disconnect', function (data) {

    });

    socket.emitListView();

};
