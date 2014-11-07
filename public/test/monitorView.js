var monitorView = {};
monitorView.first = true;

monitorView.use = function (socket, data) {
    monitorView.socket = socket;
    console.log('UI: Show Monitor panel');
    // UI: Show Monitor Panel
    if (monitorView.first) {
        // Set listeners
    }
    monitorView.first = false;
};
