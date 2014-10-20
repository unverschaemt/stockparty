 var socket = io('http://localhost/');
 socket.on('connect', function () {
     socket.send('Karl');

     socket.on('message', function (msg) {
         // my msg
         console.warn(msg);
     });
 });
