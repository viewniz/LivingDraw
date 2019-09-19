const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OptionSchema = new Schema({
    type:String,
    option:String,
    value:String,
    valueE:String
});

module.exports = mongoose.model('options', OptionSchema);
