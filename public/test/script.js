var url = 'http://localhost:4217/';

var uiConnector = {};

uiConnector.connect = function(url){
    console.log('Starting Connection...');
    siocon(url, views, devices, function error(err) {
        console.log('UI: Show connecting to server loading circle');
        // UI: Show connecting to server loading circle
        if(err === 'Invalid server address!'){
            console.log('Connection failed! Please try again!', err);
            console.log('UI: Show Invalid Server Address please again');
            // UI: Show Invalid Server Address please again
        } else {
            var msg = 'Connection error!';
            console.log('UI: Show Error Page', msg);
            // UI: Show Error Page with message msg
        }
    }, function connect(socket) {
        uiConnector.socket = socket;
        console.log('UI: Show Login fields');
        // UI: Show Login fields
    });
};

uiConnector.login = function(username, password){
    if(uiConnector.socket){
        console.log('UI: Show waiting page / loading circle');
        // UI: Show waiting page / loading circle
        uiConnector.socket.login(username, password, function loginfail(){
            console.log('UI: Show Login failed => Retry');
            // UI: Show Login failed => Retry
        });
    } else {
        var msg = 'No connection found!';
        console.log('UI: Show Error Page', msg);
        // UI: Show Error Page with message msg
    }
};
