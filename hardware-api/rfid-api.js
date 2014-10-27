var hid = require('hidstream');

/* Constants for used RFID Reader model (8H10D-1) */
var constants = {
   'VENDORID': 5050,
   'PRODUCTID': 24
};

var devices = [];

var code = '';


/* Returns array of all plugged in RFID-Readers*/
function getRFIDDevices() {
   
    var allDevices = hid.getDevices();
   
    for(var i in allDevices) {
        if(allDevices[i].vendorId == constants.VENDORID && allDevices[i].productId == constants.PRODUCTID) {
            //allDevices[i].serialNumber = '1';
            devices.push(allDevices[i]);
         }
    }
    
    if(devices.length > 0) {
	registerListener();
    return devices;
    }
    else {
        return 'No RFID Reader found';
    }
}

/* Listens for a scan on all available RFID Readers */
function registerListener() {
    for(var i in devices) {
        var rfidReader = new hid.device(devices[i].path);
        
            rfidReader.on('data', function(dat) {
					var c = dat.charCodes[0];
					if(c != null) { 
                        if(c === '\n') { // /n at the end of every code
                        console.log(code);
                        
                        code = '';
                        }
                        else {
                        code += c;
                        }					
					}
			});
	}

}

console.log(getRFIDDevices());

