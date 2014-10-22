var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var fileSchema = new Schema({
    time: Number,
    drink: Number,
    price: Number
});

module.exports = mongoose.model('PriceHistory', fileSchema);
