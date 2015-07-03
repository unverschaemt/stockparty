var addedCash = 0;
var cashPanelView = {};
cashPanelView.first = true;
cashPanelView.currentPrices = {};
cashPanelView.use = function(socket, data) {
	cashPanelView.socket = socket;
	console.log('UI: Show cash panel');
	showCashPanel();
	cashPanelView.disableCashPanel();
	// UI: Show cash Panel
	if (cashPanelView.first) {
		// Set listeners
		socket.on('drinkupdate', function(data) {
			console.log('data.drinks', data.drinks);
			updateDrinks(data.drinks);
		});
		socket.on('neworder', function(data) {
			cashPanelView.currentPrices = data;
			console.warn('neworder', data);
			cashPanelView.enableCashPanel();
			userAccountBalance.innerHTML = data.guest.balance;
			simulatedNewUserBalance.getElementsByTagName("span")[0].innerHTML = cashPanelView.currentPrices.guest.balance;
			for (var i in data.priceEntry.drinks) {
				document.getElementById("Button" + i)
					.getElementsByClassName("currentPrice")[0].innerHTML = data.priceEntry.drinks[i].price + "€";
			}
		});

	}
	cashPanelView.first = false;
};

cashPanelView.enableCashPanel = function() {
	grayOverlayer.style.display = "none";
}
cashPanelView.disableCashPanel = function() {
	grayOverlayer.style.display = "block";
}
cashPanelView.payDrinks = function() {
	if (orderPriceValue > cashPanelView.currentPrices.guest.balance) {
		toggleAddCashPanel(userBalance.getElementsByTagName("i")[0]);
		addCashAmount.innerHTML = (orderPriceValue - cashPanelView.currentPrices.guest.balance) + "€";
	} else {
		var addCashObject = {
			guestID: cashPanelView.currentPrices.guest.idk,
			priceID: cashPanelView.currentPrices.priceEntry._id,
			drinks: [{
				type: 'balance',
				balance: addedCash
			}]
		}
		orderedDrinks.forEach(function(item) {
			addCashObject.drinks.push({
				type: 'drink',
				drinkID: item._id,
				quantity: document.getElementById(item._id)
					.childNodes[0].getElementsByTagName("span")[0].innerHTML
			})
		})
		cashPanelView.socket.emit('cashpanelbuy', addCashObject, function(success) {
			/*if (success) {
				cashPanelView.cleanUserOrder();
				simulatedNewUserBalance.getElementsByTagName("span")[0].innerHTML = "0.00"
				userAccountBalance.innerHTML = "0.00"
				cashPanelView.disableCashPanel();
			} else {
				console.log("error while paying order")
			}*/

         cashPanelView.closePad();
		})
	}
}
cashPanelView.closePad = function () {
   addedCash = 0;
   cashPanelView.cleanUserOrder();
   simulatedNewUserBalance.getElementsByTagName("span")[0].innerHTML = "0.00"
   userAccountBalance.innerHTML = "0.00"
   cashPanelView.disableCashPanel();
}

cashPanelView.cancelAddUserCash = function() {
	toggleAddCashPanel(userBalance.getElementsByTagName("i")[0]);
}
cashPanelView.addUserCash = function() {
	var cashToAdd;
	if (addCashAmount.innerHTML.replace("€", "") == "") {
		cashToAdd = 0;
	} else {
		cashToAdd = parseFloat(addCashAmount.innerHTML.replace("€", ""));
	}
	addedCash += cashToAdd;
	userAccountBalance.innerHTML = roundValue(parseFloat(userAccountBalance.innerHTML) + cashToAdd);
	simulatedNewUserBalance.getElementsByTagName("span")[0].innerHTML = roundValue(parseFloat(simulatedNewUserBalance.getElementsByTagName("span")[0].innerHTML) + cashToAdd);
	toggleAddCashPanel(userBalance.getElementsByTagName("i")[0]);
}
cashPanelView.cleanUserOrder = function() {
	orderPriceValue = 0.00;
	userOrder.innerHTML = "";
	orderedDrinks = [];
	simulatedNewUserBalance.getElementsByTagName("span")[0].innerHTML = userAccountBalance.innerHTML;
	totalPrice.getElementsByTagName("span")[0].innerHTML = 0.00;
}