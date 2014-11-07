var monitorView = {};

monitorView.use = function (socket, data) {
    monitorView.socket = socket;
    console.log('UI: Show Monitor panel');
    // UI: Show Monitor Panel
    monitorView.first = false;
};

