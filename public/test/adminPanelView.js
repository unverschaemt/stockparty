var adminPanelView = {};

adminPanelView.use = function (socket, data) {
    adminPanelView.socket = socket;
    console.log('UI: Show admin panel');
    // UI: Show Admin Panel
    adminPanelView.first = false;
};

