var adminPanelView = {};
adminPanelView.first = true;

adminPanelView.use = function (socket, data) {
    adminPanelView.socket = socket;
    console.log('UI: Show admin panel');
    adminPanelView.show(); // UI: Show Admin Panel
    if (adminPanelView.first) {
        // Set listeners
        socket.on('configupdate', function (data) {
            adminPanelView.updateClientAndDeviceList(data);
            adminPanelView.updatePartyActive();
        });
        socket.on('drinkupdate', function (data) {
            adminPanelView.updateDrinkList(data);
        });
        socket.on('priceupdate', function (data) {
            adminPanelView.updatePrices(data);
        });
        if (socket.configdata) {
            adminPanelView.updateClientAndDeviceList(socket.configdata);
        }
    }
    adminPanelView.first = false;
};

adminPanelView.show = function () {
    clientSelectionPanel.style.display = "none";
    adminPanel.style.display = "block";
};

adminPanelView.updateClientAndDeviceList = function (c) {
    console.error('new config', c);
    var devices = '';
    for (var i in c.config.clients) {
        if (c.config.clients[i]) {
            devices += '<li>' + c.config.clients[i].name + ' ' + c.config.clients[i]._id + ' ' + c.runtime[i].connections + '</li>';
        }
    }
    for (var i in c.config.devices) {
        if (c.config.devices[i]) {
            devices += '<li>' + c.config.devices[i].name + ' ' + c.config.devices[i]._id + ' ' + c.runtime[i].client + '</li>';
        }
    }
    clientDeviceList.innerHTML = devices;
};

adminPanelView.updateDrinkList = function (l) {
    console.error('new drinklist', l);
    var data = '';
    //return;
    for (var i in l.drinks) {
        if (l.drinks[i]) {
            var d = l.drinks[i];
            var checked = '';
            if (d.soldOut) {
                checked = 'checked';
            }
            var id = "'" + i + "'";
            data += '<tr><td>' + d.name + '</td><td>' + d.size + '</td><td id="currentPrice' + i + '">2,80€</td><td>' + d.priceMin + '€</td><td>' + d.priceMax + '€</td><td><label><input type="checkbox" onclick="adminPanelView.toggleSoldOut(' + id + ')" class="ios-switch bigswitch" ' + checked + ' /><div><div></div></div></label></td><td><i class="fa fa-remove" onclick="adminPanelView.removeDrink(' + id + ')"></i></td></tr>';
        }
    }
    adminDrinkList.innerHTML = data;
    adminPanelView.updatePrices(adminPanelView.prices);
};

adminPanelView.updatePrices = function (p) {
    adminPanelView.prices = p;
    console.error('new prices', p);
    for (var i in p.priceEntry.drinks) {
        if (p.priceEntry.drinks[i]) {
            if (document.getElementById('currentPrice' + i)) {
                var elem = document.getElementById('currentPrice' + i);
                elem.innerHTML = p.priceEntry.drinks[i].price + '€';
            }
        }
    }
};

adminPanelView.addDrink = function () {
    var obj = {};
    obj.name = addDrinkName.value;
    obj.size = addDrinkSize.value;
    obj.priceMin = addDrinkMinPrice.value;
    obj.priceMax = addDrinkMaxPrice.value;
    console.log('sendadddrink', obj);
    adminPanelView.socket.emit('adddrink', obj, function (cb) {
        console.warn('adddrinkcb', cb);
    });
};

adminPanelView.removeDrink = function (id) {
    var obj = {};
    obj.drinkID = id;
    console.log('sendremovedrink', obj);
    adminPanelView.socket.emit('removedrink', obj, function (cb) {
        console.warn('removedrink', cb);
    });
};

adminPanelView.togglePartyActive = function () {
    adminPanelView.socket.configdata.config.global.running = !adminPanelView.socket.configdata.config.global.running;
    adminPanelView.socket.emit('setconfig', adminPanelView.socket.configdata.config);
    adminPanelView.updatePartyActive();
};

adminPanelView.updatePartyActive = function () {
    partyActiveCheckbox.checked = adminPanelView.socket.configdata.config.global.running;
};

adminPanelView.toggleStockCrash = function () {
    adminPanelView.socket.configdata.config.global.stockcrash = !adminPanelView.socket.configdata.config.global.stockcrash;
    adminPanelView.socket.emit('setconfig', adminPanelView.socket.configdata.config);
    adminPanelView.updateStockCrash();
};

adminPanelView.updateStockCrash = function () {
    stockCrashEnable.checked = adminPanelView.socket.configdata.config.global.stockcrash;
};

adminPanelView.toggleSoldOut = function(id){

};
