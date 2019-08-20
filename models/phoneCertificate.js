const mongoose = require('mongoose');
let moment = require('moment');
require('moment-timezone');

moment.tz.setDefault("Asia/Seoul");

const Schema = mongoose.Schema;

const certificatePhone = new Schema({
    email:{type: String, required: true},
    phoneNumber: {type: String, required: true},
    token: {type: Number, required: true},
    timer: {type: String}
});

module.exports = mongoose.model('phoneCert', certificatePhone);
