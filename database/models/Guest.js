var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var fileSchema = new Schema({
    idk: String,
    name: String,
    birthDate: Number
});

module.exports = mongoose.model('Guest', fileSchema);
