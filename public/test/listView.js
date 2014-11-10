var listView = {};

listView.first = true;

listView.use = function (socket, data) {
    listView.socket = socket;
    console.log('UI: Show clientlist of data', data);
    // UI: Show clientlist of data
    if(!listView.first){
        console.log('UI: Show that an error was thrown while performing last choice');
        // UI: Show that an error was thrown while performing last choice
    }
    listView.first = false;
};

listView.choose = function(cid){
    console.log('UI: Show loading for client choice');
    // UI: Show loading for client choice
    if(listView.socket){
        listView.socket.clientchoice(cid);
    } else {
        var msg = 'No server connection found!';
        console.log('UI: Show error page', msg);
        // UI: Show error page with message msg
    }
}
