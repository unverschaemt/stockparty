var cashPanelView = {};

cashPanelView.use = function (socket, data) {
    cashPanelView.socket = socket;
    console.log('UI: Show cash panel');
    // UI: Show cash Panel
    cashPanelView.first = false;
};

