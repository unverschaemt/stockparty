var cashPanelView = {};
cashPanelView.first = true;
cashPanelView.currentPrices = {};
cashPanelView.use = function (socket, data) {
    cashPanelView.socket = socket;
    console.log('UI: Show cash panel');
    showCashPanel();
    cashPanelView.disableCashPanel();
    // UI: Show cash Panel
    if (cashPanelView.first) {
        // Set listeners
        socket.on('drinkupdate', function (data) {
            console.log('data.drinks', data.drinks);
            updateDrinks(data.drinks);
        });
        socket.on('neworder', function (data) {
            cashPanelView.currentPrices = data;
            console.warn('neworder', data);
            cashPanelView.enableCashPanel();
            userAccountBalance.innerHTML = data.guest.balance;
            for (var i in data.priceEntry.drinks) {
                document.getElementById("Button" + i).getElementsByClassName("currentPrice")[0].innerHTML = data.priceEntry.drinks[i].price + "€";
            }
        });

    }
    cashPanelView.first = false;
};

cashPanelView.enableCashPanel = function () {
    grayOverlayer.style.display = "none";
}
cashPanelView.disableCashPanel = function () {
    grayOverlayer.style.display = "block";
}
