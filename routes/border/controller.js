let express = require('express');
let bodyParser = require('body-parser');
var fs = require('fs');

let app = express();

let Border = require('../../models/border');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

exports.border_main= function(req, res, next) {
    Border.find(function (err, border) {
        res.render('border/border_detail',{border:border});
    });
};

exports.product_detail= function(req, res, next) {
    let borderNum=req.params.id;
    Border.findOne({_id:borderNum},function (err, border) {
        res.render('border/product',{border:border});
    });
};