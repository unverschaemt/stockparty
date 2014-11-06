var io = require('socket.io-client');
//var views = require('./views.js');
//var devices = require('./devices.js');
var colors = require('colors');
var readline = require('readline');
var siocon = require('../apis/siocon.js');

var superagent = require('superagent');

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
        socket.login(username, password, function error() {
            console.log('Login incorrect! Please try again!'.red);
            showlogin(socket);
        });
    });
};

var getServerAddress = function (socket) {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('> Please enter the server address: '.yellow, function (addr) {
        rl.close();
        url = addr;
        startConnection();
    });
};

var url = 'http://localhost:4217/';

var startConnection = function () {
    console.log('Starting Connection...');
    siocon(url, function error(err) {
        console.log('Connection failed! Please try again!'.red, err);
        getServerAddress();
    }, function connect(socket) {
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
