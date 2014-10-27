/*var socket = io('http://localhost:3000/?username=karl&password=test223'); //&password=test223
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
    siocon.socket = socket;
    socket.on('connect', function () {
        console.info('Connected to Socket.IO Server: '+url);
    });
    socket.on('view', function (data) {
        console.log('view => ' + JSON.stringify(data));
        if (data.cconfig.devices === true) {
            for (var i in devices) {
                devices[i].use(socket);
            }
        }
        if (views[data.view]) {
            views[data.view].use(socket, data);
        }
    });
    socket.on('configupdate', function (data) {
        socket.configdata = data;
    });

    socket.on('err', function (data) {
        console.error(data);
        console.log('Destroy Socket');
        socket.destroy();
        error(data);
    });
    socket.on('error', function (e) {
        if (e === 'Authentication error') {
            console.log('Destroy Socket');
            socket.destroy();
            error(e);
        }
        console.error(e);
    });
    socket.on('disconnect', function (e) {
        console.info('Connected to Socket.IO');
    });

}
