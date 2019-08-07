let express = require('express');
let bodyParser = require('body-parser');
let passport = require('passport');

let app = express();

const Cert = require('../../models/certification');
const User = require('../../models/user');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

exports.user_submit = function (req, res, next) {
    res.render('./user/submit');
};
exports.user_login = function (req, res, next) {
    res.render('./user/login');
};
exports.user_confirm_certificate = function (req, res, next) {
    const token=req.params.id;
    Cert.findOne({token:token},function (err, cert) {
        if(!cert)
        {
            res.render('./user/login'); //만료된 인증 링크
        }
        else
        {
            User.findOne({id:cert.email},function (err,user) {
                if(!user)
                {
                    res.render('./user/login'); //유저 못 찾음. cert db error
                }
                else
                {
                    user.isCertificate=true;
                    User.findOneAndUpdate({_id:user._id}, user, function (err, result) {
                        if (err) {
                            console.error('UpdateOne Error ', err);
                        }
                        res.render('./user/certificate');
                    });
                }
            })
        }
    });
};

exports.user_submit_post = function (req, res, next) {
    passport.authenticate('signUp', function(err, user, info) {
        if (err) { res.send(err); return next(err); }
        else{ res.send(info.message); }
    })(req, res, next);
};