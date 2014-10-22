var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var fileSchema = new Schema({
    guest: String,
    time: Number,
    drink: Number,
    quantity: Number
});

module.exports = mongoose.model('Consumption', fileSchema);
