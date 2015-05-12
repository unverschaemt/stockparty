var chart;
var orderedDrinks = [];
var orderPriceValue = 0.0;
var serverConnected = false;

function addDrink(drink) {
    var newDrink = document.createElement("span");
    newDrink.classList.add("drink");
    newDrink.id = "Button" + drink._id;
    drink.size = "0.5";
    newDrink.innerHTML = drink.name + "<span>" + drink.size + '</span><br><span class="currentPrice"></span>';
    newDrink.addEventListener("click", function () {
        drink.currentPrice = cashPanelView.currentPrices.priceEntry.drinks[drink._id].price;
        addDrinkToUserOrder(drink)
    });
    drinkList.appendChild(newDrink);
}

function roundValue(value) {
    return Math.round(value * 100) / 100;
}

function addDrinkToUserOrder(drink) {
    var drinkAlreadyExists = false;
    for (var i in orderedDrinks) {
        if (orderedDrinks[i]._id == drink._id) {
            drinkAlreadyExists = true;
        }
    }
    if (drinkAlreadyExists) {
        var userOrderElement = document.getElementById(drink._id);
        console.log(userOrderElement);
        userOrderElement.getElementsByClassName("drinkCount")[0].innerHTML = parseFloat(userOrderElement.getElementsByClassName("drinkCount")[0].innerHTML) + 1;
        userOrderElement.getElementsByClassName("drinkPrice")[0].innerHTML = roundValue(parseFloat(userOrderElement.getElementsByClassName("drinkPrice")[0].innerHTML) + drink.currentPrice);
    } else {
        var newUserOrderElement = document.createElement("tr");
        newUserOrderElement.id = drink._id;
        newUserOrderElement.innerHTML = '<td width="10%"><span class="drinkCount">1</span>x</td><td width="10%">' + drink.size + '</td><td width="65%">' + drink.name + '</td><td width="15%"><span class="drinkPrice">' + drink.currentPrice + '</span>€</td>';
        orderedDrinks.push(drink);
        userOrder.appendChild(newUserOrderElement);
    }
    orderPriceValue += drink.currentPrice;
    orderPriceValue = Math.round(orderPriceValue * 100) / 100;
    simulatedNewUserBalance.getElementsByTagName("span")[0].innerHTML = roundValue(cashPanelView.currentPrices.guest.balance - orderPriceValue);
    totalPrice.getElementsByTagName("span")[0].innerHTML = orderPriceValue;
}


function addCash(char) {
    var temp = addCashAmount.innerHTML.replace("€", "");
    if (temp == "") {
        if (char == "0") {
            return;
        }
    }
    if (temp.substr(temp.length - 3, 1) == ".") {
        return;
    }
    temp += char;
    temp += "€";
    addCashAmount.innerHTML = temp;
}

function removeCash() {
    var temp = addCashAmount.innerHTML.replace("€", "");
    temp = temp.substr(0, temp.length - 1);
    temp += "€";
    addCashAmount.innerHTML = temp;
}

function updateDrinks(drinks) {
    drinkList.innerHTML = "";
    for (var drink in drinks) {
        addDrink(drinks[drink])
    }
    updateDrinkList(3);
}

function updateDrinkList(columns) {
    var listHeight = orderList.clientHeight;
    var listCount = drinkList.childNodes.length;
    var widthPercentage = (100 / columns) + "%";
    for (var j = 0; j < 2; ++j) {
        for (var i = 0; i < drinkList.childNodes.length; i++) {
            var newHeight = (listHeight / (listCount / columns));
            drinkList.childNodes[i].style.width = widthPercentage;
            drinkList.childNodes[i].style.height = newHeight + "px";
        }
    }
}


function login() {
    if (!serverConnected) {
        uiConnector.connect("blablu", function (success) {
            if (success) {
                serverConnected = true;
                uiConnector.login(username.value, password.value, function () {
                    showErrorMessage("Wrong login");
                    console.log("failed");
                });
                console.log("success");
            } else {
                showErrorMessage("Connect server error");
                console.log("failed");
            };
        });
    } else {
        uiConnector.login(username.value, password.value, function () {
            showErrorMessage("Wrong login");
            console.log("failed");
        });
    }
}

function showClientList(data) {
    data = data.data;
    loginPanel.style.display = "none";
    clientSelectionPanel.style.display = "block";
    for (var item in data) {
        var id = "'" + data[item]._id + "'";
        var typeIcon;
        if (data[item].type == "cashpanel") {
            typeIcon = '<i class="fa fa-calculator"></i>';
        } else if (data[item].type == "monitor") {
            typeIcon = '<i class="fa fa-line-chart"></i>';
        } else if (data[item].type == "connector") {
            typeIcon = '<i class="fa fa-plug"></i>';
        } else {
            typeIcon = '<i class="fa fa-tasks"></i>';
        }
        if (username.value.indexOf("aylor") != -1) {
            if (data[item].type == "cashpanel") {
                clientSelection.innerHTML += '<div><ul onclick="listView.choose(' + id + ')"><li>' + data[item].connections + "</li><li>" + data[item].name + "<br><span>" + data[item]._id + "</span></li><li>" + typeIcon + "</li></ul></div>";
            }
        } else {
            clientSelection.innerHTML += '<div><ul onclick="listView.choose(' + id + ')"><li>' + data[item].connections + "</li><li>" + data[item].name + "<br><span>" + data[item]._id + "</span></li><li>" + typeIcon + "</li></ul></div>";
        }
    }
}

function showCashPanel() {
    clientSelectionPanel.style.display = "none";
    cashPanel.style.display = "block";
    userOrderTable.style.height = (orderList.offsetHeight - orderListControlPanel.offsetHeight - userBalance.offsetHeight) + "px";
}

function showErrorMessage(error) {
    console.log(error);
}

function showErrorPage(text) {
    //TODO:ERROR PAGE
    alert("ERROR");
};


function switchNavigationTabs(navigationTab, page) {
    tabs.style.marginLeft = ((page - 1) * -100) + "%";
    document.getElementsByClassName("actuellTab")[0].classList.remove("actuellTab");
    navigationTab.classList.add("actuellTab");
}

function toggleAddCashPanel(button) {
    addCashAmount.innerHTML = "€";
    if (button.classList.contains("open")) {
        userAddCash.style.display = "none";
        userOrderTable.style.display = "block";
        orderListControlPanel.style.display = "block";
        button.classList.remove("open");
        drinkListOverlayer.style.display = "none";
    } else {
        userAddCash.style.display = "block";
        userOrderTable.style.display = "none";
        orderListControlPanel.style.display = "none";
        button.classList.add("open");
        drinkListOverlayer.style.display = "block";
    }
}

function showGraph() {
    chart = new Highcharts.Chart({
        chart: {
            renderTo: 'graphContainer',
        },
        plotOptions: {
            line: {
                marker: {
                    enabled: false
                },
                animation: false
            }
        },
    });
    startGraphAnimation();
}

function startGraphAnimation() {
    for (var i = 0; i < 10; ++i) {
        chart.addSeries([]);
    }
    for (var i = -1; i < 500; ++i) {
        setTimeout('addPoint()', i * 20000);
    }
}

function addPoint() {
    for (var i = 0; i < chart.series.length; ++i) {
        chart.series[i].addPoint((Math.random() * Math.random() * 5) * 2);
    }
}

window.onload = loadPage;
window.onresize = loadPage;