
var express = require('express');
var connection = require('./connection/connection.js');
require('socket.io-client');
var app = express();

app.get('/socket.io.js', function (req, res) {
    res.sendFile(__dirname + '/node_modules/socket.io-client/socket.io.js');
});

app.use(express.static(__dirname + '/public'));

var io = require('socket.io').listen(app.listen(3000));


// Login check
io.use(function (socket, next) {
    console.log(socket.request.url);
    if (socket.request._query.username && socket.request._query.password) {
        console.log("Super");
        next();
    } else  {
        next(new Error('Authentication error'));
    }
    //if (socket.request.headers.cookie) return next();
    //next(new Error('Authentication error'));
});

/*io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});*/

var counter = 0;

io.sockets.on('connection', function (socket) {
    console.log('Connected '+socket.id);

    connection.use(socket);

    socket.on('disconnect', function () {
        console.log('Disconnected '+socket.id);
    });
});
