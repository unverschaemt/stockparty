var cashPanelView = {};
cashPanelView.first = true;

cashPanelView.use = function (socket, data) {
    cashPanelView.socket = socket;
    console.log('UI: Show cash panel');
    // UI: Show cash Panel
    if (cashPanelView.first) {
        // Set listeners
    }
    cashPanelView.first = false;
};
