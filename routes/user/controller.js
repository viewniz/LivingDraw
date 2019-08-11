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
            res.render('./user/certificate',{result:'tokenError'}); //만료된 인증 링크==토큰 못 찾음
        }
        else
        {
            User.findOne({email:cert.email},function (err,user) {
                if(!user)
                {
                    res.render('./user/certificate',{result:'userError'}); //유저 못 찾음.
                }
                else
                {
                    user.isCertificate=true;
                    User.findOneAndUpdate({_id:user._id}, user, function (err, result) {
                        if (err) {
                            console.error('UpdateOne Error ', err);
                        }
                        else
                        {
                            Cert.remove({token:token},function(err,result){});
                            res.render('./user/certificate',{result:'complete'});
                        }
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

exports.user_login_post= function(req, res, next) {
    passport.authenticate('login', function(err, user, info) {
        if (err) {res.send(err); return next(err); }
        if (!user) {res.send(info.message); return}
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            res.send('clear');
        });
    })(req, res, next);
};

exports.user_logout_post= function(req, res){
    req.logout();
    res.send('clear');
};
