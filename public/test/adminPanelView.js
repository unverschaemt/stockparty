var adminPanelView = {};
adminPanelView.first = true;

adminPanelView.use = function (socket, data) {
    adminPanelView.socket = socket;
    console.log('UI: Show admin panel');
    // UI: Show Admin Panel
    if (adminPanelView.first) {
        // Set listeners
    }
    adminPanelView.first = false;
};
