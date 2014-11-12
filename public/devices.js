// Register Here All Devices
var devices = {};
if (typeof module !== 'undefined' && module.exports) {
    // NOTE: Node.JS
    devices.rfid = require('../hardware-api/rfid-api.js');
}
