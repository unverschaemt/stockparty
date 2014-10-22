var express = require('express');
require('socket.io-client');
var app = express();

app.get('/socket.io.js', function (req, res) {
    res.sendFile(__dirname + '/node_modules/socket.io-client/socket.io.js');
});

app.use(express.static(__dirname + '/public'));

var io = require('socket.io').listen(app.listen(3000));


//JUST Some Test Code Following
io.use(function (socket, next) {
    console.log(socket.request.url);
    //console.log(socket.request._query);
    //console.log(socket.request);
    if (socket.request._query.username && socket.request._query.password) {
        console.log("Super");
        next();
    } else  {
        next(new Error('Authentication error'));
    }
    //if (socket.request.headers.cookie) return next();
    //next(new Error('Authentication error'));
});

var events = {
    "mytest": []
};

/*io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});*/

var counter = 0;

io.sockets.on('connection', function (socket) {
    socket.send("HELLO SOMEONE");
    if (!socket.dustin) {
        socket.dustin = counter;
        counter++;
    }
    console.log("NewUser: " + socket.dustin);

    socket.on('message', function (msg) {
        console.log("Hallo Super");
        socket.send("Hallo " + msg);
    });
    socket.on('eventbind', function (msg) {
        if (!events[msg.event]) {
            events[msg.event] = [];
        }
        if (events[msg.event].indexOf(socket) < 0) {
            events[msg.event].push(socket);
            console.log("Add");
        }
        console.log(events.mytest.length);
        //socket.send("Hallo "+msg);
    });
    socket.on('triggerevent', function (msg) {
        if (events[msg.event]) {
            for (var i in events[msg.event]) {
                events[msg.event][i].send(msg.data);
                console.log("Trigger");
            }
        }
        console.log(events.mytest.length);
        //events[msg.event].push(socket);
        //socket.send("Hallo "+msg);
    });
    socket.on('ferret', function (name, fn) {


        fn('woot');
        socket.emit('ferret1', 'tobias', function (data) {
            console.log("FERET = > "+data); // data will be 'woot'
        });
    });

    socket.on('disconnect', function () {
        console.log("LOG1");
        for (var i in events) {
            var j = events[i].indexOf(socket);
            if (j >= 0) {
                events[i].splice(j, 1);
                console.log("removed");
            }
        }
        console.log(events.mytest.length);
    });
});
