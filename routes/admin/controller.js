let express = require('express');
let bodyParser = require('body-parser');
let multer=require('multer');

let app = express();

let Border = require('../../models/border');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let Picture_storage=multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,'./public/img/'+file.fieldname);
    },
    filename: function (req, file, cb) {
        cb(null,Date.now()+"!"+file.originalname);
    }
});

exports.admin_main= function(req, res, next) {
    res.render('admin/index');
};
exports.admin_login= function(req, res, next) {
    res.render('admin/login');
};
exports.admin_border= function(req, res, next) {
    res.render('admin/border');
};
exports.admin_border_insert= function(req, res, next) {
    res.render('admin/border_insert');
};
exports.admin_border_upload= function(req, res, next) {
    console.log(req.body);
    console.log(req.files);

    res.redirect('./insert');
};