const mongoose = require('mongoose');
const moment = require('moment');
require('moment-timezone');

moment.tz.setDefault("Asia/Seoul");

const Schema = mongoose.Schema;

const payments_result = new Schema({
    pg: {type:String},
    pay_method: {type:String},
    merchant_uid: {type:String},
    name: {type:String},
    amount: {type:Number},
    buyer_email: {type:String},
    buyer_name: {type:String},
    buyer_tel: {type:String},
    buyer_addr: {type:String},
    buyer_postcode: {type:String},
    result: {type:String},
    imp_uid: {type:String},
    paid_amount: {type:Number},
    apply_num: {type:String},
    status: {type:String},
    receipt_url: {type:String}
});

module.exports = mongoose.model('payments_result', payments_result);
