var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var fileSchema = new Schema({
    idk: String,
    balance: Number,
    name: String,
    birthDate: Number
});

module.exports = mongoose.model('Guest', fileSchema);
