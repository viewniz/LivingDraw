const mongoose = require('mongoose');
let moment = require('moment');
require('moment-timezone');

moment.tz.setDefault("Asia/Seoul");

const Schema = mongoose.Schema;

const certificate = new Schema({
    email: {type: String, required: true},
    token: {type: String, required: true},
    iv: {type: String, required: true},
    timer: {type: String}
});

module.exports = mongoose.model('cert', certificate);
