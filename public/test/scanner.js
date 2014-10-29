function getHTTPObject() {
    if (window.ActiveXObject) return new ActiveXObject("Microsoft.XMLHTTP");
    else if (window.XMLHttpRequest) return new XMLHttpRequest();
    else {
        alert("Dein Browser unterstuetzt kein AJAX!");
        return null;
    }
}

var scanner = {};

scanner.port = 4217;

scanner.goCb = function (goReq, callback) {
    if (goReq.readyState == 4) {
        var found = goReq.responseText == 'StockParty Server by David Ehlen, Robin Frischmann, Nils Hirsekorn, Dustin Hoffner';

        if (callback) {
            callback(found);
        }
        //console.info(goReq);
    }
    //console.info("Status: " + goReq.status);
    //console.info("Status Text: " + goReq.statusText);
};

scanner.go = function (ip, callback) {
    var goReq = getHTTPObject();
    if (goReq != null) {
        goReq.timeout = 4000;
        goReq.onreadystatechange = function () {
            scanner.goCb(goReq, callback);
        };
        goReq.onerror = function (e) {
            //console.error(e);
        }
        goReq.open("GET", "http://" + ip + "/server.txt", true);
        goReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        goReq.send();
    }
};

scanner.search = function () {
    var running = true;
    var started = 0;
    var ended = 0;
    var serverfound = 0;
    var prefix = '172.16'; // 172.16.57.228
    //while(running){
    for (var j = 56; j < 58; j++) {
        for (var i = 0; i < 255; i++) {
            started++;
            var ip = prefix + '.' + j + '.' + i + ':' + scanner.port;
            try{
            scanner.go(ip, function (found) {
                ended++;
                if (found) {
                    console.log("GEFUNDEN !!!!!! YEHAAAAAAAAA");
                    serverfound++;
                }
                if (ended % 30 === 0 || ended === started) {
                    console.log('Es sind ' + ended + " von " + started + " abgeschlossen!");
                    if (serverfound < 1 && ended === started) {
                        console.error('Nichts gefunden :(');
                    }
                }
            });
            } catch(e){
                console.warn(e);
            }
        }
    }
    //}
};
