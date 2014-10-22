var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var fileSchema = new Schema({
    time: Number,
    level: Number,
    guest: String
});

module.exports = mongoose.model('AlcoholLevel', fileSchema);
