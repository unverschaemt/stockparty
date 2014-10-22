var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var fileSchema = new Schema({
    time: Number,
    drinks: Array
});

module.exports = mongoose.model('PriceHistory', fileSchema);
