if (typeof module !== 'undefined' && module.exports) {
    //    // NOTE: Node.JS
    //    var views = require('../connector/views.js');
    //    var devices = require('../connector/devices.js');
    var superagent = require('superagent');
    var io = require('socket.io-client');
}

var serverVerifier = 'StockParty Server by David Ehlen, Robin Frischmann, Nils Hirsekorn, Dustin Hoffner';

var siocon = function (url, views, devices, error, connect) {
    if (url === '') {
        return error('Invalid server address!');
    }
    if (url[url.length - 1] !== '/') {
        url += '/';
    }
    superagent.get(url + 'server.txt').end(function (err, res) {
        if (err || res.text !== serverVerifier) {
            //console.error('Invalid server address!');
            return error('Invalid server address!');
        }
        var socket = io(url);
        //siocon.socket = socket;
        var load = true;
        socket.clientchoice = function (client, callback) {
            socket.chosenclient = client;
            socket.emit('clientchoice', {
                'clientid': client
            }, function err(error) {
                //console.error('ERROR: ' + error);
                socket.chosenclient = false;
                /*if (views['list']) {
                    views['list'].use(socket, socket.viewdata);
                }*/
                if (callback) {
                    callback(error);
                }
            });
        };

        socket.login = function (username, password, callback) {
            socket.emit('login', {
                'username': username,
                'password': password
            }, callback);
            socket.username = username;
            socket.password = password;
            socket.loginfailcb = callback;
        };

        socket.on('connect', function () {
            //console.info('Connected to Socket.IO Server: ' + url);
            if (socket.username && socket.password && socket.loginfailcb && socket.loginwasgood) {
                socket.login(socket.username, socket.password, socket.loginfailcb);
            } else  {
                connect(socket);
            }
        });
        socket.on('view', function (data) {
            socket.loginwasgood = true;
            socket.viewdata = data;
            if (data.view === 'list' && socket.chosenclient) {
                return socket.clientchoice(socket.chosenclient);
            }
            if (views[data.view]) {
                views[data.view].use(socket, data);
            }
        });
        socket.on('configupdate', function (data) {
            socket.configdata = data;
            if (load) {
                load = false;
                for (var i in devices) {
                    devices[i].use(socket);
                }
            }
        });

        socket.on('err', function (data) {
            socket.destroy();
            error(data);
        });

        socket.on('error', function (e) {
            socket.destroy();
            error(e);
        });

        socket.on('disconnect', function (e) {
            load = true;
            //console.info('Disconnected from Socket.IO');
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    // NOTE: Node.JS
    module.exports = siocon;
}
