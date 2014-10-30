var io = require('socket.io-client');
var views = require('./views.js');
var devices = require('./devices.js');
var colors = require('colors');
var readline = require('readline');

/*var socket = io('http://localhost:4217/?username=karl&password=test223'); //&password=test223
socket.on('connect', function () {

});
socket.on('view', function (data) {
    console.log('view => ' + JSON.stringify(data));
});
socket.on('error', function (e) {
    if (e === 'Authentication error') {
        console.log('Destroy Socket');
    }
    console.error(e);
});
socket.on('err', function (data) {
    console.error(data);
});
var temo = {};
socket.on('configupdate', function (data) {
    console.warn(data);
    temo = data;
});*/

var siocon = function (url, username, password, error) {
    var socket = io(url + '?username=' + username + '&password=' + password); //&password=test223
    //siocon.socket = socket;
    var load = true;
    socket.clientchoice = function (client) {
        socket.emit('clientchoice', {
            'clientid': client
        });
    };

    socket.on('connect', function () {
        console.info('Connected to Socket.IO Server: ' + url);
    });
    socket.on('view', function (data) {
        if (views[data.view]) {
            views[data.view].use(socket, data);
        }
    });
    socket.on('configupdate', function (data) {
        socket.configdata = data;
        console.log('New Config', data);
        if (load) {
            load = false;
            for (var i in devices) {
                devices[i].use(socket);
            }
        }
    });

    socket.on('err', function (data) {
        //console.error(data);
        //console.log('Destroy Socket');
        socket.disconnect();
        socket.close();
        socket.destroy();
        socket = null;
        delete socket;
        error(data);
    });
    socket.on('error', function (e) {
        if (e === 'Authentication error') {
            //console.log('Destroy Socket');
            socket.disconnect();
            socket.close();
            socket.destroy();
            socket = null;
            delete socket;
            error(e);
        }
        //console.error(e);
    });
    socket.on('disconnect', function (e) {
        console.info('Disconnected from Socket.IO');
    });
}


var showlogin = function () {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('> Please enter your username: '.yellow, function (username) {
        rl.close();
        showloginpw(username);
    });
};
var showloginpw = function (username) {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('> Please enter your password: '.yellow, function (password) {
        rl.close();
        //console.log('Username: ' + username + ' Password: ' + password);
        startConnection(username, password);
    });
};

var startConnection = function (username, password) {
    console.log('Starting Connection...');
    siocon('http://localhost:4217/', username, password, function (err) {
        if (err === 'Authentication error') {
            console.log('Authentication error! Please try again!'.red);
        } else {
            console.log('Connection failed! Please try again!'.red);
        }
        showlogin();
    });
};
showlogin();

// Start APP
/*siocon('http://localhost:4217/', 'hans', 'pass', function (err) {
    console.log('ERROR:');
    console.error(err);
});*/
