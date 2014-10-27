var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var fileSchema = new Schema({
    guest: String,
    priceID: Number,
    drink: String,
    quantity: Number,
    time: Number
});

module.exports = mongoose.model('Consumption', fileSchema);
