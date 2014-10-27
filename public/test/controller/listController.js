var list = {};

list.use = function (socket, data) {
    list.socket = socket;
    // TODO: Show ClientList with data
};

list.choice = function (choice) {
    if (list.socket) {
        list.socket.clientchoice = choice;
        list.socket.emit('clientchoice', {
            'clientid': choice
        });
        list.socket = null;
    } else {
        console.warn('');
    }
};
