var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var fileSchema = new Schema({
    userName: String,
    password: String,
    name: String,
    role: Object
});

module.exports = mongoose.model('User', fileSchema);
