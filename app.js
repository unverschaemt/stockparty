var welcome = require('./welcome.js');
var colors = require('colors');
//Loading Config:
var configfunctions = require('./connection/configfunctions.js');
configfunctions.loadInitialConfigSync(__dirname+"/config.json");


var express = require('express');
var connection = require('./connection/connection.js');
var login = require('./connection/login.js');
var config = require('./connection/config.js');
var config2 = require('./config.json');
var mongoose = require('mongoose');
require('socket.io-client');
var app = express();

// Loading Database:
var db = mongoose.connect(config2.global.db || "mongodb://localhost/stockparty");

// Check Default user
var userInterface = require('./database/UserInterface.js');

userInterface.init(function(err){
    console.error('Failed to generate default admin user'.red);
});

app.get('/socket.io.js', function (req, res) {
    res.sendFile(__dirname + '/node_modules/socket.io-client/socket.io.js');
});

app.get('/superagent.js', function (req, res) {
    res.sendFile(__dirname + '/node_modules/superagent/superagent.js');
});

app.get('/server.txt', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.send('StockParty Server by David Ehlen, Robin Frischmann, Nils Hirsekorn, Dustin Hoffner');
});

app.use(express.static(__dirname + '/public'));
app.use('/apis', express.static(__dirname + '/apis'));

var io = require('socket.io').listen(app.listen(config.data.global.port));

io.sockets.on('connection', function (socket) {
    console.log('Connected '+socket.id);
    socket.loggedId = false;

    login.use(socket);

    socket.on('disconnect', function () {
        console.log('Disconnected '+socket.id);
    });
});
