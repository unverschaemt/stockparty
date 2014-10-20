var express = require('express');
require('socket.io-client')
var app = express();

app.get('/socket.io.js', function (req, res) {
  res.sendFile(__dirname+'/node_modules/socket.io-client/socket.io.js');
});

app.use(express.static(__dirname + '/public'));

var io = require('socket.io').listen(app.listen(3000));


//JUST Some Test Code Following
io.use(function(socket, next){
    console.log(socket.request);
    if (socket.request.headers.cookie) return next();
    next(new Error('Authentication error'));
});

var events = {};

/*io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});*/

io.sockets.on('connection', function (socket) {
  socket.on('message', function (msg) {
        socket.send("Hallo "+msg);
  });
  socket.on('eventbind', function (msg) {
      if(!events[msg.event]){
          events[msg.event] = [];
      }
      events[msg.event].push(socket);
      //socket.send("Hallo "+msg);
  });
  socket.on('triggerevent', function (msg) {
      if(!events[msg.event]){
          events[msg.event] = [];
      }
      events[msg.event].push(socket);
      //socket.send("Hallo "+msg);
  });
  socket.on('disconnect', function () { });
});
