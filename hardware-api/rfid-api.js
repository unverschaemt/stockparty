var getmac = require('getmac');
var monitor = require('usb-detection');
var hid = require('hidstream');


/* Constants for used RFID Reader model (8H10D-1) */
var constants = {
    'VENDORID': 5050,
    'PRODUCTID': 24
};

var devices = [];
var rfidReaders = [];
var code = '';
var allReaders = [];
var disconnected = false;

var rfidApi = module.exports = {};
rfidApi.first = true;

rfidApi.use = function (socket) {
    rfidApi.socket = socket;
    if (disconnected) {
        disconnected = false;
        console.log(devices);
        for (var i in devices) {
            rfidApi.socket.emit('iddplugin', {
                    'hid': devices[i].hid
                });
              rfidApi.listenForScan(i);
        }
    }
    if (rfidApi.first) {
        rfidApi.socket.on('disconnect', function (data) {
            disconnected = true;
            for (var i in rfidReaders) {
               rfidReaders[i].close();
                
            }
        });
    }
    rfidApi.first = false;
};

/* Listens for a scan on all available RFID Readers */
rfidApi.listenForScan = function (arrIndex) {
    console.log("Arr Index:");
    console.log(arrIndex);
    var allDevices = hid.getDevices();
    for (var j in allDevices) {
        if (allDevices[j].productId === constants.PRODUCTID && allDevices[j].vendorId === constants.VENDORID) {
            if (allReaders.length == 0) {
                allReaders.push(allDevices[j]);
            } else {
                for (var i in allReaders) {
                    if (allReaders[i].path !== allDevices[j].path) {
                        allReaders.push(allDevices[j]);

                    }
                }
            }
        }
    }

    console.log(allReaders);
    var rfidReader = new hid.device(allReaders[arrIndex].path);
    rfidReaders.push(rfidReader);
    devices[arrIndex].path = '' + rfidReader.path;
    rfidReader.on('data', function (dat) {
        var c = dat.charCodes[0];
        if (c != null) {
            if (c === '\n') { // /n at the end of every code
                console.log('data.received:');
                console.log(code);
                getmac.getMac(function (err, macAddress) {
                    if (err) {
                        rfidApi.socket.emit('idderror', {
                            'error': err
                        });
                    }
                    rfidApi.socket.emit('iddscan', {
                        'hid': '' + macAddress + '-' + devices[arrIndex].serialNumber + '',
                        'idk': '' + code + ''
                    });
                    code = '';
                });

            } else {
                code += c;
            }
        }
    });
    rfidReader.on('error', function (err) {
        rfidApi.socket.emit('idderror', {
            'error': err
        });
    });

}


//TODO: Pfad holen und listener registrieren, Pfad mit node-hid möglich ?!
monitor.on('add:' + constants.VENDORID + ':' + constants.PRODUCTID + '', function (scannedDevices, err) {
    var arrayIndex = 0;
    var serNum = 0;
    if (devices.length == 0) {
        console.log("erster reader");
        scannedDevices.serialNumber = '0';
        serNum = 0;
        devices.push(scannedDevices);

    } else {
        for (var i = 0; i < devices.length + 1; i++) {
            if (devices[i] == null) {
                scannedDevices.serialNumber = '' + i;
                devices[i] = scannedDevices;
                arrayIndex = i;
                serNum = i;
                break;


            } else {
                if (i != 0) {
                    scannedDevices.serialNumber = '' + devices.length;
                    devices.push(scannedDevices);
                    arrayIndex = devices.length - 1;
                    serNum = devices.length;
                }

            }
        }
    }

    rfidApi.listenForScan(arrayIndex);

    getmac.getMac(function (err, macAddress) {
        if (err) {
            rfidApi.socket.emit('idderror', {
                'error': err
            });
        }
        devices[arrayIndex].hid = '' + macAddress + '-' + serNum + '';

          rfidApi.socket.emit('iddplugin', {
                'hid': '' + macAddress + '-' + scannedDevices.serialNumber + ''
            });
    });


});
monitor.on('remove:' + constants.VENDORID + ':' + constants.PRODUCTID + '', function (scannedDevices, err) {
    var serNumber = getDevice(scannedDevices.locationId).serialNumber;
    nullDevice(scannedDevices.locationId);

    for (var i in rfidReaders) {
        if (rfidReaders[i].path === scannedDevices.path) {
            rfidReaders[i].close();
        }
    }
    getmac.getMac(function (err, macAddress) {
        if (err) {
            rfidApi.socket.emit('idderror', {
                'error': err
            });
        }
        rfidApi.socket.emit('iddremove', {
            'hid': '' + macAddress + '-' + serNumber + ''
        });
    });
});


function getDevice(locId) {
    for (var i in devices) {
        if (devices[i] && devices[i].locationId === locId) {
            return devices[i];
        }
    }
}

function nullDevice(locId) {
    for (var i in devices) {
        if (devices[i] && devices[i].locationId === locId) {
            devices[i] = null;
        }
    }
}
