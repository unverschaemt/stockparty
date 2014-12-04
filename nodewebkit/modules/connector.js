var siocon = require('./siocon.js');


var listview = {};
listview.use = function (socket, data) {
    window.console.log('choose client003');
    socket.clientchoice('client003');
}

var views = {};
views.list = listview;


var devices =   {};
devices.rfid = require('../hardware-api/rfid-api.js');
var gsocket;
siocon('http://localhost:4217/', views, devices, function (err) {
    window.alert('error loading');
}, function (socket) {
    window.console.log('connected');
    gsocket = socket;
    socket.login('admin', 'admin', function (err) {
        window.alert('error login');
    });
});
