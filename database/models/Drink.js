var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var fileSchema = new Schema({
    name: String,
    priceMin: Number,
    priceMax: Number,
    soldOut: Boolean
});

module.exports = mongoose.model('Drink', fileSchema);
