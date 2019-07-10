let express = require('express');
let bodyParser = require('body-parser');
var fs = require('fs');
let app = express();
let Border = require('../../models/border');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

exports.index_main= function(req, res, next) {
    res.render('index/index');
};

