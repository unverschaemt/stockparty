
        var siocon = require('./modules/siocon.js');

        var listview = {};
        listview.use = function(socket, data){
            socket.clientchoice('client003');
        }

        var views = {};
        views.list = listview;


        var devices = {};
        //devices.rfid = require('./hardware-api/rfid-api.js');
        var gsocket;
        siocon('http://localhost:4217/', views, devices, function(err){
            alert('error loading');
        }, function (socket){
            gsocket = socket;
            socket.login('admin', 'admin', function(err){
                alert('error login');
            });
        });
