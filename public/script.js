var token = "testtttkkkk";
var socket = io('http://localhost:9001/?username=karl&password=test223');
 socket.on('connect', function () {
     socket.send('Karl');

     socket.on('message', function (msg) {
         // my msg
         console.warn(msg);
     });

     socket.on('ferret1', function (name, fn) {
        fn('moinmoin');
    });
 });
 socket.on('error', function(e){
     console.error("error");
     console.error(e);
 });
