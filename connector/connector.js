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

var siocon = function (url, error, connect) {
    var socket = io(url); //&password=test223
    //siocon.socket = socket;
    var load = true;
    socket.clientchoice = function (client, callback) {
        socket.emit('clientchoice', {
            'clientid': client
        }, callback);
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
        console.info('Connected to Socket.IO Server: ' + url);
        if(socket.username && socket.password && socket.loginfailcb && socket.loginwasgood){
            socket.login(socket.username, socket.password, socket.loginfailcb);
        } else {
            connect(socket);
        }
    });
    socket.on('view', function (data) {
        socket.loginwasgood = true;
        console.log("new View: "+data.view);
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


var showlogin = function (socket) {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('> Please enter your username: '.yellow, function (username) {
        rl.close();
        showloginpw(socket, username);
    });
};
var showloginpw = function (socket, username) {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('> Please enter your password: '.yellow, function (password) {
        rl.close();
        //console.log('Username: ' + username + ' Password: ' + password);
        socket.login(username, password, function error(){
            console.log('Login incorrect! Please try again!'.red);
            showlogin(socket);
        });
    });
};
var startConnection = function () {
    console.log('Starting Connection...');
    siocon('http://localhost:4217/', function error(err) {
        console.log('Connection failed! Please try again!'.red);
    }, function connect(socket){
        console.log('> Successfully connected!'.green);
        showlogin(socket);
    });
};

startConnection();

// Start APP
/*siocon('http://localhost:4217/', 'hans', 'pass', function (err) {
    console.log('ERROR:');
    console.error(err);
});*/
