

var iddService = require('../services/iddService.js');
var configUpdateService = require('../services/configUpdateService.js');
var priceUpdateService = require('../services/priceUpdateService.js');
var config = require('../config.js');
//var buy = require('../config.js');
var m = module.exports = {};

m.use = function (socket) {
    // client specific methods

    socket.iddscan = function (obj) {
        socket.emit('newbuy', {
            //'buy': buy.getNewBuy(obj.idk)
            'buy': {'test':42}
        });
    };

    // Add event listeners
    socket.on('cashpanelbuy', function (data, fn) {
        if (config.data.clients[socket.clientid].type === 'cashpanel') {
            //buy.executeBuy(data, fn, fn);
        }
    });
    socket.on('cashscreen', function (data) {
        if (config.data.clients[socket.clientid].type === 'cashpanel' && config.data.clients[socket.clientid].cashscreen !== '') {
            if(config.runtime[config.data.clients[socket.clientid].cashscreen] && config.runtime[config.data.clients[socket.clientid].cashscreen].sockets){
               for(k in config.runtime[config.data.clients[socket.clientid].cashscreen].sockets){
                   if(config.runtime[config.data.clients[socket.clientid].cashscreen].sockets[k].sendCashScreen){
                       config.runtime[config.data.clients[socket.clientid].cashscreen].sockets[k].sendCashScreen(data);
                   }
               }
            }
        }
    });

    // required Services
    configUpdateService.use(socket);
    iddService.use(socket);
    priceUpdateService.use(socket);

    // Initial Data Push
};
