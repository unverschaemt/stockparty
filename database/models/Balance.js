var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var fileSchema = new Schema({
    time: Number,
    guest: String,
    balance: Number
});

module.exports = mongoose.model('Balance', fileSchema);
