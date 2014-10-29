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
socket.configdata = {
    "global": {
        "configmode": true,
        "devicenameprefix": "device",
        "clientnameprefix": "client",
        "configfilepath": "/Users/hex0r/BitBucket/stockings/source/config.json",
        "port": 4217
    },
    "clients": {
        "client00": {
            "_id": "client00",
            "name": "ADMIN",
            "type": "adminpanel",
            "maxsockets": 99999,
            "view": "adminpanel"
        },
        "client01": {
            "_id": "client01",
            "name": "Kasse 1",
            "type": "cashpanel",
            "maxsockets": 1,
            "idd": "device01",
            "view": "cashpanel"
        },
        "client02": {
            "_id": "client02",
            "name": "Kasse 2",
            "type": "cashpanel",
            "maxsockets": 1,
            "idd": "device02",
            "view": "cashpanel"
        }
    },
    "devices": {
        "device01": {
            "_id": "device01",
            "type": "idd",
            "name": "RFID Device1",
            "hid": "USB_02xd82jf"
        },
        "device02": {
            "_id": "device02",
            "type": "idd",
            "name": "RFID Device2",
            "hid": "USB_02xd82jh"
        }
    }
};

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
                            'hid': '' + macAddress + devices[i].serialNumber + '',
                            'idk': '' + code + ''
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
/* Hier nur richtige serialnumber vergabe bei 2 readern ==> verallgemeinern */
monitor.on('add:' + constants.VENDORID + ':' + constants.PRODUCTID + '', function (scannedDevices, err) {
    if (devices.length == 0) {
        scannedDevices.serialNumber = '0';
                            devices.push(scannedDevices);

    } else {
        for (var i in devices) {
            if (devices[i] == null) {
                scannedDevices.serialNumber = '' + i;
                    devices[i] = scannedDevices;
                break;


            } else {
                scannedDevices.serialNumber = '' + devices.length;
                    devices.push(scannedDevices);

            }
        }
    }

    getmac.getMac(function (err, macAddress) {
        if (err) console.error(err);
        if (socket.configdata.global.configmode == true) {
            socket.emit('iddplugin', {
                'hid': '' + macAddress + '-' + scannedDevices.serialNumber + ''
            });
        } else {
            for (var dev in socket.configdata.devices) {
                if (socket.configdata.devices[dev].hid === '' + macAddress + '-' + scannedDevices.serialNumber) {
                    socket.emit('iddplugin', {
                        'hid': '' + macAddress + '-' + scannedDevices.serialNumber + ''
                    });
                }
            }
        }
    });


});

monitor.on('remove:' + constants.VENDORID + ':' + constants.PRODUCTID + '', function (scannedDevices, err) {
                var serNumber = getDevice(scannedDevices.locationId).serialNumber;
                 nullDevice(scannedDevices.locationId);
    getmac.getMac(function (err, macAddress) {
        if (err) throw err;
        socket.emit('iddremove', {

            'hid': '' + macAddress + '-' + serNumber + ''
        });
    });
});

function getDevice(locId) {
    for (var i in devices) {
        if (devices[i].locationId === locId) {
            return devices[i];
        }
    }
}

function nullDevice(locId) {
    for (var i in devices) {
        if (devices[i].locationId === locId) {
            devices[i] = null;
            console.log("nulled index:"+i);
        }
    }
}


/*
socket.on(‘disconnect’, function (data) {
    console.log('disconnected - evtl hier noch ports etc schließen ?');
});
*/



rfidApi.use(socket);
rfidApi.listenForScan();