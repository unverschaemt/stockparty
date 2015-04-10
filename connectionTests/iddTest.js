var should = require('should');
//var io = require('socket.io-client');
siocon = null;
var siocon = require('../apis/siocon.js');

var views = {};
var devices = {};

//var server = require('../app.js');

var correctServerAddress = 'http://localhost:4217/';

var correctLogin = {
    'username': 'admin',
    'password': 'admin'
};

var client = 'client001';

var iddpluginobject = {
    'hid': '3c:15:c2:ba:7b:94-0'
};
var iddscanobject = {
    'hid': '3c:15:c2:ba:7b:94-0',
    'idk': 'test1234'
};

var orderdata;

describe("Stock Party IDD plugin/scan/remove", function () {
    //var globalSocket;
    //var orderdata;
    before(function(){
        console.log('Before Stock IDD');
    });
    after(function(){
        console.log('After Stock IDD');
    });

    it('Should connect the to the Server', function (done) {
        siocon(correctServerAddress, views, devices, function error(err) {

        }, function connect(socket) {
            if (socket) {
                var t = true;
            } else {
                var t = false;
            }
            t.should.equal(true);
            globalSocket = socket;
            done();
        });
    });
    it('Should successfully login', function (done) {
        var temp = function (data) {
            if (data && data.view === 'list') {
                var t = true;
            } else {
                var t = false;
            }
            t.should.equal(true);
            globalSocket.removeListener('view', temp);
            done();
        };
        globalSocket.on('view', temp);
        globalSocket.login(correctLogin.username, correctLogin.password, function loginfail() {

        });
    });
    it('Should successfully choose client cashpanel', function (done) {
        var d = 2;
        var checkdone = function () {
            d--;
            if (d < 1) {
                done();
            }
        };
        var temp = function (data) {
            if (data && data.config && data.config.devices && data.config.clients && data.runtime) {
                var t = true;
            } else {
                var t = false;
            }
            t.should.equal(true);
            globalSocket.removeListener('configupdate', temp);
            checkdone();
        };
        globalSocket.on('configupdate', temp);
        var temp2 = function (data) {
            if (data && data.view) {
                var t = true;
            } else {
                var t = false;
            }
            t.should.equal(true);
            globalSocket.removeListener('view', temp2);
            checkdone();
        };
        globalSocket.on('view', temp2);
        globalSocket.clientchoice(client, function error() {

        });
    });

    it('Should plugin a RFID Reader', function (done) {
        var temp = function (data) {
            for (var i in data.config.devices) {
                if (data.config.devices[i].hid === iddpluginobject.hid) {
                    var did = i;
                    break;
                }
            }
            if (did && data.runtime && data.runtime[did] && data.runtime[did].client && data.runtime[did].client === client) {
                var t = true;
            } else {
                var t = false;
            }
            t.should.equal(true);
            globalSocket.removeListener('configupdate', temp);
            done();
        };
        globalSocket.on('configupdate', temp);
        globalSocket.emit('iddplugin', iddpluginobject);
    });

    it('Should get neworder object in cashpanel when iddscan gets emited', function (done) {
        var temp = function (data) {
            if (data) { // data.guest
                var t = true;
            } else {
                var t = false;
            }
            orderdata = data;
            t.should.equal(true);
            globalSocket.removeListener('neworder', temp);
            done();
        };
        globalSocket.on('neworder', temp);
        globalSocket.emit('iddscan', iddscanobject);
    });

    it('Should have a guest and a price entry in order object', function (done) {
        should(orderdata).be.type('object');
        //console.log(orderdata);
        if (orderdata) {
            should(orderdata).have.property('guest');
            should(orderdata).have.property('priceEntry');
            should(orderdata.guest).be.type('object');
            should(orderdata.priceEntry).be.type('object');
            if (orderdata.guest !== undefined) {
                should(orderdata.guest).be.type('object');
            }
            if (orderdata.priceEntry !== undefined) {
                should(orderdata.priceEntry).be.type('object');
            }
        }
        done();
    });

    it('Should remove a RFID Reader', function (done) {
        var temp = function (data) {
            for (var i in data.config.devices) {
                if (data.config.devices[i].hid === iddpluginobject.hid) {
                    var did = i;
                    break;
                }
            }
            if (did && data.runtime && data.runtime[did] && data.runtime[did].client === '') {
                var t = true;
            } else {
                var t = false;
            }
            t.should.equal(true);
            globalSocket.removeListener('configupdate', temp);
            done();
        };
        globalSocket.on('configupdate', temp);
        globalSocket.emit('iddremove', iddpluginobject);
    });
    it('Should disconnect the socket', function (done) {
        globalSocket.on('disconnect', function(){
            done();
        });
        globalSocket.close();
    });
});
