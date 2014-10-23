var priceHistoryInterface = require('./database/PriceHistoryInterface');

var m = module.exports = {};

var refreshInterval = 0;
var status = 'pause';

m.calculatePrice = function () {
    return(true);
};

m.setRefreshInterval = function (interval) {
    
};

m.getRefreshInterval = function () {
    return refreshInterval;
};

m.triggerStockCrash = function (decision) {
    
};

m.start = function () {
    
};

m.pause = function () {
    
};

m.getStatus = function () {
    return status;
};