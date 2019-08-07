let express = require('express');
let bodyParser = require('body-parser');
let passport = require('passport');

var fs = require('fs');

let app = express();

let Border = require('../../models/border');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

exports.user_submit = function (req, res, next) {
    res.render('./user/submit');
};
exports.user_login = function (req, res, next) {
    res.render('./user/login');
};

exports.user_submit_post = function (req, res, next) {
    passport.authenticate('signUp', function(err, user, info) {
        if (err) { res.send(err); return next(err); }
        else{ res.send(info.message); }
    })(req, res, next);
};