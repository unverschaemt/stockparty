var cashPanelView = {};
cashPanelView.first = true;

cashPanelView.use = function (socket, data) {
    cashPanelView.socket = socket;
    console.log('UI: Show cash panel');
    showCashPanel();
    // UI: Show cash Panel
    if (cashPanelView.first) {
        // Set listeners
        socket.on('drinkupdate', function(data){
            updateDrinks(data.drinks);
        });
        socket.on('neworder', function(data){
            console.warn('neworder', data);
        });

    }
    cashPanelView.first = false;
};
