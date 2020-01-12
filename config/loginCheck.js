const moment = require('moment');
require('moment-timezone');

moment.tz.setDefault("Asia/Seoul");

const loginCheck = (req,res,next) => {
    const user = req.user;
    if(!user||user.isAdmin)
    {
        req.session.returnTo = req.originalUrl;
        req.session.save(err => {
            if(err) return next(err);
            req.logout();
            res.redirect('/user/login');
        });
    }else{
        return next();
    }
};
const loginCheckReverse = (req,res,next) => {
    if(req.user)
    {
        if(req.user.isAdmin)
        {
            req.session.returnTo = req.originalUrl;
            req.session.save(err=>{
                if(err) return next(err);
                req.logout();
                res.redirect('/user/login');
            });
        }
        else
        {
            const backURL=req.header('Referer') || '/border/1';
            res.redirect(backURL);
        }
    }else{
        return next();
    }
};
const sellerCheck = (req,res,next) => {
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
const sellerCheckReverse = (req,res,next) => {
    if(req.user.isSeller===true)
    {
        res.redirect('/border/1');
    }
    else
    {
        return next();
    }
};
const isPhoneCertCheck = (req,res,next) => {
    if(req.user.isPhoneCert!==true)
    {
        res.redirect('/user/author_register');
    }
    else
    {
        return next();
    }
};
const imageStudentIdenCheck = (req,res,next) => {
    if(!req.user.imageStudentIden.picOriginalName)
    {
        res.redirect('/user/author_register2');
    }
    else
    {
        return next();
    }
};
const isCertificateCheck = (req,res,next) => {
    if(req.user.isCertificate!==true)
    {
        res.redirect('/user/re_mailing');
    }
    else
    {
        return next();
    }
};

module.exports = loginCheck;
module.exports.loginCheckReverse = loginCheckReverse;
module.exports.sellerCheck = sellerCheck;
module.exports.sellerCheckReverse = sellerCheckReverse;
module.exports.isPhoneCertCheck = isPhoneCertCheck;
module.exports.imageStudentIdenCheck = imageStudentIdenCheck;
module.exports.isCertificateCheck = isCertificateCheck;
