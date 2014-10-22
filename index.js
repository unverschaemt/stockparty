var mongoose = require('mongoose');
var userInterface = require('./database/UserInterface');
var drinkInterface = require('./database/DrinkInterface');
var guestInterface = require('./database/GuestInterface');
var alcoholInterface = require('./database/AlcoholLevelInterface');
var consumptionInterface = require('./database/ConsumptionInterface');
var priceHistoryInterface = require('./database/PriceHistoryInterface');

// Create db connection
var db = mongoose.connect("mongodb://localhost/stockparty");

//userInterface.addUser("Kkoile", "pass", "Nils", {"role": "Barkeeper"});
//userInterface.getUser("5447f106856d2088b72ae70f", function error(err){console.log(err)}, function cb(obj){console.log(obj)});
//userInterface.deleteUser("5447eb9420cdd3d0b916cf5e", function error(err){console.log(err)}, function cb(obj){console.log(obj)});
//userInterface.setUserInfo("5447f106856d2088b72ae70f", {"password": "geheimesPasswort"}, function error(err){console.log(err)}, function cb(obj){console.log(obj)});

//drinkInterface.addDrink("Beer", 2.50, 5.30);
//drinkInterface.getDrink("5447f2c5c7bd909c6758a4d5", function error(err){console.log(err)}, function cb(obj){console.log(obj)});
//drinkInterface.getAllDrinks(function error(err){console.log(err)}, function cb(obj){console.log(obj)});
//drinkInterface.setDrinkInfo("5447f2c5c7bd909c6758a4d5", {"name": "Beer 0.33"}, function error(err){console.log(err)}, function cb(obj){console.log(obj)});
//drinkInterface.deleteDrink("5447f2c5c7bd909c6758a4d5", function error(err){console.log(err)}, function cb(obj){console.log(obj)});
//drinkInterface.deleteAllDrinks(function error(err){console.log(err)}, function cb(obj){console.log(obj)});

//guestInterface.addGuest("F03DA23B22", 5.23, "Peter", 12.12, function error(err){console.log(err)});
//guestInterface.getGuest("F03DA23B22", function error(err){console.log(err)}, function cb(obj){console.log(obj)});
//guestInterface.deleteGuest("F03DA23B22", function error(err){console.log(err)}, function cb(obj){console.log(obj)});
//guestInterface.deleteAllGuests(function error(err){console.log(err)}, function cb(obj){console.log(obj)});
//guestInterface.setGuestBalance("F03DA23B22", 10.00, function error(err){console.log(err)}, function cb(obj){console.log(obj)});

//alcoholInterface.addAlcoholLevel(201410222053, 2, "F03DA23B22");
//alcoholInterface.getAlcoholLevelsForOneGuest("F03DA23B22", function error(err){console.log(err)}, function cb(obj){console.log(obj)});
//alcoholInterface.getAllAlcoholLevels(function error(err){console.log(err)}, function cb(obj){console.log(obj)});
//alcoholInterface.deleteAllAlcoholLevels(function error(err){console.log(err)}, function cb(obj){console.log(obj)});

//consumptionInterface.addConsumption("F03DA23B22", 201410222053, "5447f2c5c7bd909c6758a4d5", 2);
//consumptionInterface.getConsumptionForGuest("F03DA2CB22", function error(err){console.log(err)}, function cb(obj){console.log(obj)});
//consumptionInterface.getAllConsumptionEntries(function error(err){console.log(err)}, function cb(obj){console.log(obj)});
//consumptionInterface.deleteAllConsumptionEntries(function error(err){console.log(err)}, function cb(obj){console.log(obj)});

//priceHistoryInterface.addPriceHistory(201410222053, [{id: "5447f2c5c7bd909c6758a4d5", price: 3.21}, {id: "54f7f2e5c74d909c6758a4d5", price: 6.21}]);
//priceHistoryInterface.getPricesForTime(201410222053, function error(err){console.log(err)}, function cb(obj){console.log(obj)});
//priceHistoryInterface.getPriceHistory(function error(err){console.log(err)}, function cb(obj){console.log(obj)});
//priceHistoryInterface.deleteAllPriceHistoryEntries(function error(err){console.log(err)}, function cb(obj){console.log(obj)});

