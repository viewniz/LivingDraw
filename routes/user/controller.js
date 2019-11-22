let express = require('express');
let bodyParser = require('body-parser');
let passport = require('passport');
const Confirm = require('../../config/userConfirm');
const crypto = require('crypto');
let fs = require('fs');
let moment = require('moment');
require('moment-timezone');
const request=require('request');

moment.tz.setDefault("Asia/Seoul");

let app = express();

const PhoneCert = require('../../models/phoneCertificate');
const Cert = require('../../models/certification');
const User = require('../../models/user');

const secretKey = require('../../config/SecretKey');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

exports.user_submit = function (req, res, next) {
    res.render('./user/submit');
};

exports.user_submit_end = function (req, res, next) {
    res.render('./user/submitEnd');
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
    console.log(token);
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
            {
                return res.send('메일 인증 실패');
                //return res.redirect("/user/re_mailing");
            }
            if(req.session.returnTo)
            {
                console.log(req.session.returnTo);
                res.send('clear-'+req.session.returnTo);
                delete req.session.returnTo;
            }
            else
                return res.send('clear-');
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
        else{
            if(req.session.returnTo)
            {
                res.redirect(req.session.returnTo);
                delete req.session.returnTo;
            }
            else
                res.redirect('/border');
        }
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
        if(req.session.returnTo)
        {
            res.redirect(req.session.returnTo);
            req.session.returnTo=null;
        }
        else
            if(req.session.returnTo)
            {
                res.redirect(req.session.returnTo);
                delete req.session.returnTo;
            }
            else
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

exports.author_register = function (req, res, next) {
    let lastNameE=null;
    let firstNameE=null;
    let phoneNumber=null;
    if(req.user.lastNameE)
    {
        lastNameE = req.user.lastNameE;
    }
    if(req.user.firstNameE)
    {
        firstNameE = req.user.firstNameE;
    }
    if(req.user.phoneNumber)
    {
        phoneNumber = req.user.phoneNumber;
    }

    res.render('./user/author_register',{lastNameE:lastNameE,firstNameE:firstNameE,isPhoneCert:req.user.isPhoneCert,phoneNumber:phoneNumber});
};

exports.author_register_2 = function (req, res, next) {
    let picFileName = null;
    if(req.user.imageStudentIden)
    {
        picFileName = req.user.imageStudentIden.picFilename;
    }
    res.render('./user/author_register_2',{picFileName:picFileName});
};

exports.author_register_3 = function (req, res, next) {
    res.render('./user/author_register_3');
};

exports.user_submit_smsVerification_post_ncpV2 = async function (req, res, next) {
    const phoneNumber = req.body.phoneNumber;
    const NCP_accessKey = secretKey.NCP_API_access_key;			// access key id (from portal or sub account)
    const NCP_secretKey = secretKey.NCP_API_secret_key;           // secret key (from portal or sub account)
    const NCP_serviceID = secretKey.SENS_service_ID;
    const myPhoneNumber = secretKey.myPhoneNumber;
    const space = " ";				// one space
    const newLine = "\n";				// new line
    const method = "POST";				// method
    const url = `https://sens.apigw.ntruss.com/sms/v2/services/${NCP_serviceID}/messages`;	// url (include query string)
    const url2 = `/sms/v2/services/${NCP_serviceID}/messages`;
    const timestamp = Date.now().toString();			// current timestamp (epoch)
    let message = [];
    const hmac=crypto.createHmac('sha256',NCP_secretKey);

    message.push(method);
    message.push(space);
    message.push(url2);
    message.push(newLine);
    message.push(timestamp);
    message.push(newLine);
    message.push(NCP_accessKey);
    const signature = hmac.update(message.join('')).digest('base64');

    const number = Math.floor(Math.random() * (999999 - 100000)) + 100000;

    PhoneCert.find({phoneNumber:phoneNumber}, function (err, cert) {
        if (cert)
            PhoneCert.deleteMany({email:req.user.email,phoneNumber: phoneNumber}, function (err, result) {});
        User.update({email: req.user.email}, {
            phoneNumber: phoneNumber.toString(),
        }, function () {
            req.user.phoneNumber=phoneNumber.toString();
            let newPhoneCert = new PhoneCert();
            newPhoneCert.email = req.user.email;
            newPhoneCert.phoneNumber = phoneNumber.toString();
            newPhoneCert.token = number;
            newPhoneCert.save(function (err,result) {
                if(err) console.log(err);
                request({
                    method: method,
                    json: true,
                    uri: url,
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        'x-ncp-iam-access-key' : NCP_accessKey,
                        'x-ncp-apigw-timestamp': timestamp,
                        'x-ncp-apigw-signature-v2': signature.toString()
                    },
                    body: {
                        "type":"SMS",
                        "contentType":"COMM",
                        "countryCode":"82",
                        "from": myPhoneNumber,
                        "content":`리빙드로우 인증번호 ${number}입니다.`,
                        "messages":[
                            {
                                "to":`${phoneNumber}`,
                            }
                        ]
                    }
                },function (err, res, html) {
                    if(err) console.log(err);
                });
                res.send('clear');
            });
        });
    });
};

exports.user_submit_smsVerification_post_ncpV1 = async function (req, res, next) {
    const phoneNumber = req.body.phoneNumber;
    const method = "POST";				// method
    const url = `https://api-sens.ncloud.com/v1/sms/services/${secretKey.SENS_service_ID}/messages`;	// url (include query string)
    const NCP_accessKey = secretKey.NCP_API_access_key;			// access key id (from portal or sub account)
    const myPhoneNumber = secretKey.myPhoneNumber;

    const token = await makeCertNumber(phoneNumber, req);
    await request({
        method: method,
        json: true,
        uri: url,
        headers: {
            'Content-Type': 'application/json',
            'X-NCP-auth-key': NCP_accessKey,
            'X-NCP-service-secret': secretKey.SENS_service_secret_key,
        },
        body: {
            "type": "SMS",
            "contentType": "COMM",
            "countryCode": "82",
            "from": myPhoneNumber,
            "to": [`${phoneNumber}`],
            "content": `리빙드로우 인증번호 ${token}입니다.`,
        }
    }, function (err, res, html) {
        if (err) console.log(err);
        console.log(html);
    });

    res.send('clear');
};

async function makeCertNumber(phone, req) {

    let number = Math.floor(Math.random() * (999999 - 100000)) + 100000;

    await PhoneCert.find({phoneNumber:phone}, async function (err, cert) {
        if (cert)
            await PhoneCert.deleteMany({email:req.user.email,phoneNumber: phone}, function (err, result) {});
        await User.update({email: req.user.email}, {
            phoneNumber: phone.toString(),
        }, async function () {
            req.user.phoneNumber=phone.toString();
            let newPhoneCert = new PhoneCert();
            newPhoneCert.email = req.user.email;
            newPhoneCert.phoneNumber = phone.toString();
            newPhoneCert.token = number;
            await newPhoneCert.save(async function (err,result) {
                if(err) console.log(err);
                return number;
            });
        });
    })
}

exports.user_submit_smsVerification_post = function (req, res, next) {
    const token = req.body.token;
    const phoneNumber = req.user.phoneNumber;
    PhoneCert.findOne({token:token,phoneNumber:phoneNumber},function(err, cert){
       if(!cert){
           res.send("token error");
           return;
       }
        User.update({email: req.user.email}, {
            isPhoneCert: true,
        }, function (err, result) {
            if(err)
                return;
            req.user.isPhoneCert = true;
            PhoneCert.remove({token:token,phoneNumber:phoneNumber},function(){});
            res.send("clear");
        });
    });
};

exports.user_submit_author_register_post = function (req, res, next) {
    const firstNameE = req.body.firstNameE;
    const lastNameE = req.body.lastNameE;
    const regType = /^[A-Za-z+]{1,50}$/;
    if(!regType.test(lastNameE))
    {
        res.send("Error lastName");
        return false;
    }
    if(!regType.test(firstNameE))
    {
        res.send("Error firstName");
        return false;
    }
    if(!firstNameE)
    {
        res.send("firstName is Null");
        return;
    }
    if(!lastNameE)
    {
        res.send("lastName is Null");
        return;
    }
    if(req.user.isPhoneCert!==true)
    {
        res.send("Error PhoneCert");
        return false;
    }
    User.update({email: req.user.email}, {
        firstNameE: firstNameE,
        lastNameE: lastNameE
    }, function (err, result) {
        if(err)
        {
            console.log(err);
            return;
        }
        req.user.firstNameE = firstNameE;
        req.user.lastNameE = lastNameE;
        res.send("clear");
    });
};

exports.user_submit_author_upload_student_Iden_post = function (req, res, next) {
    const limit = 20000000;
    if(req.file.mimetype!=="image/jpeg"&&req.file.mimetype!=="image/jpg")
    {
        res.send("error type");
        return false;
    }
    if(req.file.size>limit)
    {
        res.send("error size");
        return false;
    }
    User.findOne({email:req.user.email},function (err, user) {
        if(err) console.log(err);
        fs.stat(user.imageStudentIden.picDestination+'/'+user.imageStudentIden.picFilename, function(err, stat) {
            if(err == null) {
                fs.unlink(user.imageStudentIden.picDestination+'/'+user.imageStudentIden.picFilename, function(err) {
                    if (err) throw err;
                    User.updateOne({email:req.user.email},{imageStudentIden:{picOriginalName:req.file.originalname,picEncoding:req.file.encoding,picMimetype:req.file.mimetype,
                            picDestination: req.file.destination,picFilename : req.file.filename,picPath : req.file.path,picSize : req.file.size}},function (err, result) {
                        if(err) console.log(err);
                        res.send("clear");
                    })
                });
            } else {
                User.updateOne({email:req.user.email},{imageStudentIden:{picOriginalName:req.file.originalname,picEncoding:req.file.encoding,picMimetype:req.file.mimetype,
                        picDestination: req.file.destination,picFilename : req.file.filename,picPath : req.file.path,picSize : req.file.size}},function (err, result) {
                    if(err) console.log(err);
                    res.send("clear");
                });
                console.log('Some other error: ', err.code);
            }
        });
    });
};

exports.author_register_2_post = function (req, res, next) {
    if(!req.user.imageStudentIden.picOriginalName||req.user.isPhoneCert!==true)
    {
        res.send("fail");
        return;
    }
    User.updateOne({email:req.user.email},{isSignUpSeller: true},function (err, result) {
        if(err) res.send("update failed");
        res.send("clear");
    });
};