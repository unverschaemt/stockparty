var serialport = require("serialport")
var SerialPort = serialport.SerialPort

var sp;


/* ensures that the sensor gets time to heat up and selects port*/
function initializeSensor() {
    getPort(function(port){
        sp = new SerialPort(port, {
  baudrate: 9600,
  dataBits: 8,
  parser: serialport.parsers.readline('\n')
},false);
    });


}

/* initiates sensor to read a new value */
function triggerEvent() {
sp.open(function () {
  console.log('open');

  sp.on('data', function(data) {
    console.log('data received: ' + data);

  });
});
}

function getPort(callback) {
    serialport.list(function (err, ports) {
    ports.forEach(function(port) {
        console.log(port.comName);
        console.log(port.pnpId);
        console.log(port.manufacturer);
        if(port.manufacturer.indexOf('Arduino') > -1) {
            callback(port.comName)
        }
  });
});

}

initializeSensor();
triggerEvent();
