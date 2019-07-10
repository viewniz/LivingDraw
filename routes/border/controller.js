let express = require('express');
let bodyParser = require('body-parser');
var fs = require('fs');

let app = express();

let Border = require('../../models/border');

exports.border_main= function(req, res, next) {
    res.render('border/border_detail');
};

exports.product_detail= function(req, res, next) {
    let borderNum=req.params.id;
    Border.findOne({_id:borderNum},function (err, border) {
        if(err) console.log(err);
        res.render('border/product',{border:border});
    });
};