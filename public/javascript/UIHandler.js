var chart;

function addDrink(drink) {
    var newDrink = document.createElement("span");
    newDrink.classList.add("drink");
    newDrink.innerHTML = drink.name + "<span>" + drink.size + "</span>";
    newDrink.onclick = function () {
        addDrinkToUserOrder(drink)
    };
    drinkList.appendChild(newDrink);
}

function addDrinkToUserOrder(drink) {
    var newUserOrderElement = document.createElement("tr");
    newUserOrderElement.innerHTML = '<td width="10%">1x</td><td width="10%">' + drink.size + '</td><td width="65%">' + drink.name + '</td><td width="15%">2,50€</td>';
    userOrder.appendChild(newUserOrderElement);
}

function addCash(char) {
    var temp = addCashAmount.innerHTML.replace("€", "");
    if (temp == "") {
        if (char == "0") {
            return;
        }
    }
    debugger;
    if (temp.substr(temp.length - 3, 1) == ".") {
        return;
    }
    temp += char;
    temp += "€";
    addCashAmount.innerHTML = temp;
}

function removeCash() {
    var temp = addCashAmount.innerHTML.replace("€", "");
    debugger;
    temp = temp.substr(0, temp.length - 1);
    temp += "€";
    addCashAmount.innerHTML = temp;
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

function fillWithTestData() {
    addDrink({
        name: "Bier",
        size: "0.5l"
    });
    addDrink({
        name: "Vodka",
        size: "0.05l"
    });
    addDrink({
        name: "Rum",
        size: "0.05l"
    });
    addDrink({
        name: "Wein (weiß)",
        size: "0.25l"
    });
    addDrink({
        name: "Wein (rot)",
        size: "0.25l"
    });
    addDrink({
        name: "Softdrink",
        size: "0.3l"
    });
    addDrink({
        name: "Softdrink",
        size: "0.5l"
    });
    addDrink({
        name: "Wasser",
        size: "0.5l"
    });
    addDrink({
        name: "Special",
        size: "0.2l"
    });
    addDrink({
        name: "Bier",
        size: "0.5l"
    });
    addDrink({
        name: "Vodka",
        size: "0.05l"
    });
    addDrink({
        name: "Rum",
        size: "0.05l"
    });
    updateDrinkList(3);
}

function loadPage() {
    if (document.getElementById("cashPanel")) {
        fillWithTestData();
        userOrderTable.style.height = (orderList.offsetHeight - orderListControlPanel.offsetHeight - userBalance.offsetHeight) + "px";
    }
    if (document.getElementById("adminPanel")) {
        settingPanel.style.top = adminPanelMenu.offsetHeight + "px";
        settingPanel.style.height = (adminPanel.clientHeight) + "px";
    }
    if (document.getElementById("monitorPanel")) {
        loadTheme();
        showGraph();
    }
}

function login() {
    alert("das");
    window.location.href = 'cashPanel.html'
}

function connectServer(inputBox) {
    uiConnector.connect(inputBox.value, function (success) {
        if (success) {
<<<<<<< HEAD
            showLogin();
=======
            console.log("success");
>>>>>>> development/development
        } else {
            console.log("not success")
        };
    });
}

function showErrorPage(text) {
    //TODO:ERROR PAGE
    alert("ERROR");
};

function showLogin(input) {
    userlogin.style.display = "block";
    input.blur();
    serverlogin.style.display = "none";
    loginPage.innerHTML = "2 / 2"
}

function switchNavigationTabs(navigationTab, page) {
    tabs.style.marginLeft = ((page - 1) * -100) + "%";
    document.getElementsByClassName("actuellTab")[0].classList.remove("actuellTab");
    navigationTab.classList.add("actuellTab");
}

function toggleAddCashPanel(button) {
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
