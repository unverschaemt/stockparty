

var welcome = require('./welcome.js');
var colors = require('colors');
//Loading Config:
var configfunctions = require('./connection/configfunctions.js');
configfunctions.loadInitialConfigSync(__dirname+"/config.json");


var express = require('express');
var connection = require('./connection/connection.js');
var login = require('./connection/login.js');
var config = require('./connection/config.js');
var mongoose = require('mongoose');
require('socket.io-client');
var app = express();

// Loading Database:
var db = mongoose.connect('mongodb://localhost/stockparty');
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


// Login check
/*io.use(function (socket, next) {
    console.log(socket.request.url);
    if (socket.request._query.username && socket.request._query.password && socket.request._query.username === 'hans') {
        console.log("Super");
        next();
    } else  {
        next(new Error('Authentication error'));
    }
    //if (socket.request.headers.cookie) return next();
    //next(new Error('Authentication error'));
});*/

/*io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});*/

/*

var seto = function(arr, obj, to){
    if(arr.length>1){
         var x = arr.shift();
         seto(arr, obj[x], to);
    } else {
         obj[arr[0]] = to;
    }
}

*/


var counter = 0;

io.sockets.on('connection', function (socket) {
    console.log('Connected '+socket.id);
    socket.loggedId = false;

    login.use(socket);
    //connection.use(socket);

    socket.on('disconnect', function () {
        console.log('Disconnected '+socket.id);
    });
});
