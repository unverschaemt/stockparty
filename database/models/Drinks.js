var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var fileSchema = new Schema({
    idk: Number,
    name: String,
    priceMin: Number,
    priceMax: Number
});

module.exports = mongoose.model('Drinks', fileSchema);
