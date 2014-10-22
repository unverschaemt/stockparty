var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var fileSchema = new Schema({
    name: String,
    priceMin: Number,
    priceMax: Number
});

module.exports = mongoose.model('Drink', fileSchema);
