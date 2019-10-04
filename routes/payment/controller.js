const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
require('moment-timezone');
const request=require('request');

moment.tz.setDefault("Asia/Seoul");

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

exports.payment_request = function (req, res, next) {
    const mid = "INIpayTest";
    const signKey = "SU5JTElURV9UUklQTEVERVNfS0VZU1RS";
    res.render('./payment/INIStdPayRequest');
};

exports.user_submit_end = function (req, res, next) {
    res.render('./user/submitEnd');
};
