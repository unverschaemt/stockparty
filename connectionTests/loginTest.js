var should = require('should');
//var io = require('socket.io-client');
siocon = null;
var siocon = require('../apis/siocon.js');

var views = {};
var devices = {};

//var server = require('../app.js');

var invalidServerAddress = 'http://localhost:1234/';
var correctServerAddress = 'http://localhost:4217/';

var invalidLogin = {
    'username': 'admin',
    'password': 'invalid'
};
var correctLogin = {
    'username': 'admin',
    'password': 'admin'
};

var invalidClient = 'invalid';
var correctClient = 'client000';

var globalSocket;


describe("Stock Party Client-Server Connection", function () {
    it('Should throw an error when Server not found.', function (done) {
        siocon(invalidServerAddress, views, devices, function error(err) {
            err.should.equal('Invalid server address!');
            done();
        }, function connect(socket) {

        });
    });
    it('Should fire connect event when Server found.', function (done) {
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
    it('Should fire an login error event when user login is invalid', function (done) {
        globalSocket.login(invalidLogin.username, invalidLogin.password, function loginfail() {
            done();
        });
    });
    it('Should fire view event with value data.view === "list" after valid login', function (done) {
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
    it('Should fire an error when an invalid client was chosen', function (done) {
        globalSocket.clientchoice(invalidClient, function error() {
            done();
        });
    });
    it('Should fire configupdate event with data.config when a correct client was chosen. And should fire a view event', function (done) {
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
        globalSocket.clientchoice(correctClient, function error() {

        });
    });
    it('Should disconnect the socket', function (done) {
        globalSocket.close();
        done();
    });
});
