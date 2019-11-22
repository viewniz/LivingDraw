let express = require('express');
let bodyParser = require('body-parser');
var fs = require('fs');
let app = express();
let Border = require('../../models/border');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

exports.exhibition_main= function(req, res, next) {
    res.render('exhibition/exhibition_main');
};

exports.exhibition_detail= function(req, res, next) {
    res.render('exhibition/exhibition_detail');
};

