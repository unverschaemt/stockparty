var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var fileSchema = new Schema({
    time: Number,
    drinks: Object
});

module.exports = mongoose.model('PriceHistory', fileSchema);
