var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var fileSchema = new Schema({
    guest: String,
    priceID: String,
    drink: String,
    quantity: Number,
    time: Number
});

module.exports = mongoose.model('Consumption', fileSchema);
