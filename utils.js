var m = module.exports = {};

m.numberToString = function (i, c) {
    var s = i.toString();
    while (s.length < c) {
        s = '0' + s;
    }
    return s;
};
