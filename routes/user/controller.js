let express = require('express');
let bodyParser = require('body-parser');
let passport = require('passport');
const Confirm = require('../../config/userConfirm');

let app = express();

const Cert = require('../../models/certification');
const User = require('../../models/user');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

exports.user_submit = function (req, res, next) {
    res.render('./user/submit');
};
exports.user_login = function (req, res, next) {
    let redirectUrl = req.query.redirectUrl;

    if (redirectUrl) {
        res.cookie("redirectUrl", redirectUrl, {
            expires: new Date(Date.now() + (60 * 1000 * 2)),
            httpOnly: true
        });
    }
    let error=req.flash('error')[0];
    if(error){
        res.render('./user/login',{error:error});
        return
    }
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

exports.user_re_mailing = function (req, res, next) {
    res.render('./user/certificateRe');
};

exports.user_re_mailing_post = function (req, res, next) {
    const email=req.user.email;
    const lastName=req.user.lastName;
    const firstName=req.user.firstName;
    Cert.remove({email:email},function (err, result) {
        if(err) return err;
        try { // statements to try
            Confirm(email, lastName + firstName); // function could throw exception
        }
        catch (e) {
            res.send('메일 발송 실패! 잠시 뒤 다시 시도 해 주세요.');
            return;
        }
        res.send('clear');
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
            if (!user.isCertificate)
                return res.send('메일 인증 실패');
            return res.send('clear');
        });
    })(req, res, next);
};

exports.user_logout= function(req, res){
    req.logout();
    res.redirect('/border');
};

exports.user_logout_post= function(req, res){
    req.logout();
    res.send('clear');
};

exports.google_login = passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.email','profile']});

exports.google_login_callback = function (req,res,next){
    passport.authenticate('google', function(err, user, info) {
        if(!user)
        {
            req.flash('error',info);
            res.redirect('/user/login');
        }
        else
            res.redirect('/border');
    })(req, res, next);
};

exports.kakao_login = passport.authenticate('kakao',{ scope: ['profile','gender','age_range','account_email']});

exports.kakao_login_callback = function (req,res,next){
    passport.authenticate('kakao', function(err, user, info) {
        if(!user)
        {
            req.flash('error',info);
            res.redirect('/user/login');
        }
        else
            res.redirect('/user/auth/social');
    })(req, res, next);
};

exports.naver_login = passport.authenticate('naver',{ scope: ['profile']});

exports.naver_login_callback = function (req,res,next){
    passport.authenticate('naver', function(err, user, info) {
        if(!user)
        {
            req.flash('error',info);
            res.redirect('/user/login');
        }
        else
            res.redirect('/user/auth/social');
    })(req, res, next);
};


exports.social_add_name = function(req,res,next){
    if(!(req.user.firstName===undefined))
    {
        res.redirect('/border');
    }
    else{
        res.render('./user/socialSubmitAddName');
    }
};

exports.social_add_name_post = async function (req, res, next) {
    let checkRegNameFirst = await checkRegName(req.body.firstName);
    let checkRegNameLast = await checkRegName(req.body.lastName);
    if (checkRegNameFirst === 1)
    {
        res.send('이름 정규식 에러');
        return;
    }
    if (checkRegNameLast === 1)
    {
        res.send('성 정규식 에러');
        return;
    }

    User.update({email: req.user.email}, {
        firstName: req.body.firstName,
        lastName: req.body.lastName
    }, function (err, result) {
        if (err) {
            res.send(err);
        }
        res.send('clear');
    })
};

async function checkRegName(name)
{
    const nameCheck = /^[가-힣]+[가-힣]{0,30}$/g;
    const subCheck1 = '$ne';
    const subCheck2 = '$lt';
    const subCheck3 = '$gt';
    const subCheck4 = '$lte';
    const subCheck5 = '$gte';
    if(!nameCheck.test(name) || !(name.indexOf(subCheck1)===-1) || !(name.indexOf(subCheck2)===-1) || !(name.indexOf(subCheck3)===-1) || !(name.indexOf(subCheck4)===-1) || !(name.indexOf(subCheck5)===-1))
    {
        return 1;
    }
    return 2;
}
