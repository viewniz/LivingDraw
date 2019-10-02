let express = require('express');
let bodyParser = require('body-parser');
let moment = require('moment');
require('moment-timezone');

moment.tz.setDefault("Asia/Seoul");

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

exports.login_check = function(req,res,next){
    if(!req.user)
    {
        res.redirect('/user/login');
    }
    else if(req.user.isAdmin)
    {
        req.logout();
        res.redirect('/user/login');
    }
    else
    {
        return next();
    }
};
exports.login_check_reverse = function(req,res,next){
    if(req.user)
    {
        const backURL=req.header('Referer') || '/border/1';
        res.redirect(backURL);
    }
    else
    {
        return next();
    }
};
exports.seller_check = function(req,res,next){
    if(req.user.isSeller!==true)
    {
        if(req.user.isSignUpSeller===true)
            res.redirect('/user/author_register3');
        else
            res.redirect('/user/author_register');
    }
    else
    {
        return next();
    }
};
exports.seller_check_reverse = function(req,res,next){
    if(req.user.isSeller===true)
    {
        res.redirect('/border/1');
    }
    else
    {
        return next();
    }
};
exports.isPhoneCert_check = function(req,res,next){
    if(req.user.isPhoneCert!==true)
    {
        res.redirect('/user/author_register');
    }
    else
    {
        return next();
    }
};
exports.imageStudentIden_check = function(req,res,next){
    if(!req.user.imageStudentIden.picOriginalName)
    {
        res.redirect('/user/author_register2');
    }
    else
    {
        return next();
    }
};
exports.isCertificate_check = function(req,res,next){
    if(req.user.isCertificate!==true)
    {
        res.redirect('/user/re_mailing');
    }
    else
    {
        return next();
    }
};