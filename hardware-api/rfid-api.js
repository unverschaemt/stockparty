var hid = require('hidstream');
var getmac = require('getmac');
var monitor = require('usb-detection');

/* Constants for used RFID Reader model (8H10D-1) */
var constants = {
    'VENDORID': 5050,
    'PRODUCTID': 24
};

var devices = [];

var code = '';

var rfidApi = {};
var socket = {};
var deviceNumber = 0;

socket.emit = function (a, b) {
    console.log(a + ' => ' + b.hid);
}


rfidApi.use = function (socket) {
    rfidApi.socket = socket;
};


/* Listens for a scan on all available RFID Readers */
rfidApi.listenForScan = function () {
    for (var i in devices) {
        var rfidReader = new hid.device(devices[i].path);

        rfidReader.on('data', function (dat) {
            var c = dat.charCodes[0];
            if (c != null) {
                if (c === '\n') { // /n at the end of every code
                    console.log(code);
                    getmac.getMac(function (err, macAddress) {
                        if (err) console.error(err);
                        socket.emit('iddscan', {
                            'hid': '' + macAddress + devices[i].serialNumber,
                            'idk': '' + code
                        });
                    });

                    code = '';
                } else {
                    code += c;
                }
            }
        });
        rfidReader.on("error", function (err) {
            console.warn(err);
        });
    }

}

monitor.on('add:' + constants.VENDORID + ':' + constants.PRODUCTID + '', function (scannedDevices, err) {

    scannedDevices.serialNumber = '' + deviceNumber;
    devices.push(scannedDevices);
    getmac.getMac(function (err, macAddress) {
        if (err) console.error(err);
        if (socket.configdata.global.configmode == true) {
            socket.emit('iddplugin', {
                'hid': '' + macAddress + '-' + deviceNumber
            });
        } else {
            for (var dev in socket.configdata.devices) {
                if (socket.configdata.devices[dev].hid === '' + macAddress + '-' + devices.length) {
                    socket.emit('iddplugin', {
                        'hid': '' + macAddress + '-' + deviceNumber
                    });
                }
            }
        }

    });

    deviceNumber++;
    for (var i in devices) {
        console.log(devices[i].serialNumber);
    }
});

monitor.on('remove:' + constants.VENDORID + ':' + constants.PRODUCTID + '', function (scannedDevices, err) {
    getmac.getMac(function (err, macAddress) {
        if (err) throw err;
        socket.emit('iddremove', {
            'hid': '' + macAddress + '-' + scannedDevices.serialNumber,
            'idk': '' + code
        });
    });
});

/*
socket.on(‘disconnect’, function (data) {
    console.log('disconnected - evtl hier noch ports etc schließen ?');
});
*/



rfidApi.use(socket);
rfidApi.listenForScan();