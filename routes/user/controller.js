const passport = require('passport');
const Confirm = require('../../config/userConfirm');
const crypto = require('crypto');
const moment = require('moment');
require('moment-timezone');
const request=require('request');

moment.tz.setDefault("Asia/Seoul");

const PhoneCert = require('../../models/phoneCertificate');
const Cert = require('../../models/certification');
const User = require('../../models/user');

const secretKey = require('../../config/SecretKey');
const imageRemove = require('../../config/imageRemove');
const regExpression = require('../../config/regExpression');

const submit = (req, res) => {
    res.render('./user/submit');
};

const submitEnd = (req, res) => {
    res.render('./user/submitEnd');
};

const login = (req, res) => {
    const error=req.flash('error')[0];
    if(error){
        return res.render('./user/login',{error:error});
    }
    res.render('./user/login');
};

const confirmCertificate = async (req, res) => {
    const token = req.params.id;
    //옵저버 적용할 것
    const cert = await Cert.findOne({token:token}, (err, cert) => {
        if(err) {
            console.log(err);
            return null;
        }
        return cert;
    });
    if(!cert) {
        return res.render('./user/certificate', {result:'tokenError'}); //만료된 인증 링크==토큰 못 찾음
    }
    User.findOne({email:cert.email}, (err,user) => {
        if(!user) return res.render('./user/certificate',{result:'userError'}); //유저 못 찾음.
        user.isCertificate=true;
        User.findOneAndUpdate({_id:user._id}, user, (err) => {
            if (err) {
                res.render('./user/certificate',{result:'updateError'});
            }
            Cert.deleteOne({token:token},(err) => {if(err) console.log(err);});
            res.render('./user/certificate',{result:'complete'});
        });
    });
};

const reMailing = (req, res) => {
    res.render('./user/certificateRe');
};

const p_reMailing = (req, res) => {
    const email=req.user.email;
    const lastName=req.user.lastName;
    const firstName=req.user.firstName;
    Cert.deleteOne({email:email}, err => {
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

const p_submit = (req, res, next) => {
    passport.authenticate('signUp', (err, user, info) => {
        if (err) { res.send(err); return next(err); }
        else{ res.send(info.message); }
    })(req, res, next);
};

const p_login= (req, res, next) => {
    passport.authenticate('login', (err, user, info) => {
        if (err) {res.send(err); return next(err); }
        if (!user) {res.send(info.message); return;}
        req.logIn(user, err => {
            if (err) { return next(err); }
            if (!user.isCertificate) {
                return res.send('메일 인증 실패');
            }
            if(req.session.returnTo) {
                res.send('clear-'+req.session.returnTo);
                return delete req.session.returnTo;
            }
            return res.send('clear-');
        });
    })(req, res, next);
};

const logout= (req, res) => {
    req.logout();
    res.redirect('/border');
};

const p_logout= (req, res) => {
    req.logout();
    res.send('clear');
};

const googleLogin = passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.email','profile']});

const googleLoginCallback = (req,res,next) => {
    passport.authenticate('google', (err, user, info) => {
        if(!user) {
            req.flash('error',info);
            return res.redirect('/user/login');
        }
        if(req.session.returnTo) {
            res.redirect(req.session.returnTo);
            return delete req.session.returnTo;
        }
        res.redirect('/border');
    })(req, res, next);
};

const kakaoLogin = passport.authenticate('kakao',{ scope: ['profile','gender','age_range','account_email']});

const kakaoLoginCallback = (req,res,next) => {
    passport.authenticate('kakao', (err, user, info) => {
        if(!user) {
            req.flash('error', info);
            return res.redirect('/user/login');
        }
        res.redirect('/user/auth/social');
    })(req, res, next);
};

const naverLogin = passport.authenticate('naver',{ scope: ['profile']});

const naverLoginCallback = (req,res,next) => {
    passport.authenticate('naver', (err, user, info) => {
        if(!user) {
            req.flash('error',info);
            return res.redirect('/user/login');
        }
        res.redirect('/user/auth/social');
    })(req, res, next);
};

const socialAddName = (req, res) => {
    if(req.user.firstName!==undefined)
    {
        if(req.session.returnTo)
        {
            res.redirect(req.session.returnTo);
            return delete req.session.returnTo;
        }
        return res.redirect('/border');
    }
    res.render('./user/socialSubmitAddName');
};

const p_socialAddName = async (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const checkRegNameFirst = await regExpression(firstName,'koreanOnly');
    const checkRegNameLast = await regExpression(lastName,'koreanOnly');
    if (!checkRegNameFirst || firstName.length > 30 || firstName.length < 1) {
        return res.send('이름 정규식 에러');
    }
    if (!checkRegNameLast || lastName.length > 30 || lastName.length < 1) {
        return res.send('성 정규식 에러');
    }

    User.update({email: req.user.email}, {
        firstName: firstName,
        lastName: lastName
    }, err => {
        if (err) {
            return res.send(err);
        }
        res.send('clear');
    });
};

const authorRegister = (req, res) => {
    const lastNameE=req.user.lastNameE ? req.user.lastNameE : null;
    const firstNameE=req.user.firstNameE ? req.user.firstNameE : null;
    const phoneNumber=req.user.phoneNumber ? req.user.phoneNumber : null;

    res.render('./user/author_register',
        {lastNameE:lastNameE,firstNameE:firstNameE,isPhoneCert:req.user.isPhoneCert,phoneNumber:phoneNumber});
};

const authorRegister2 = (req, res) => {
    const picFileName = req.user.imageStudentIden ? req.user.imageStudentIden.picFilename : null;

    res.render('./user/author_register_2',{picFileName:picFileName});
};

const authorRegister3 = (req, res) => {
    res.render('./user/author_register_3');
};

const p_submitSmsVerificationNcpV2 = async (req, res) => {
    const phoneNumber = req.body.phoneNumber.toString();
    if(!await regExpression(phoneNumber,"number")||phoneNumber.length>12||!phoneNumber)
        return res.send("phoneNumber Error");
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
    const hmac = crypto.createHmac('sha256', NCP_secretKey);

    message.push(method);
    message.push(space);
    message.push(url2);
    message.push(newLine);
    message.push(timestamp);
    message.push(newLine);
    message.push(NCP_accessKey);
    const signature = hmac.update(message.join('')).digest('base64');

    const number = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    const cert = await PhoneCert.findOne({phoneNumber: phoneNumber}, (err, cert) => {
        if (err) {
            console.log(err);
            return null;
        }
        return cert;
    });
    if (cert)
        await PhoneCert.deleteMany({email: req.user.email, phoneNumber: phoneNumber}, () => {});
    User.update({email: req.user.email}, {
        phoneNumber: phoneNumber,
    }, err => {
        if (err) {
            console.log(err);
        }
    });
    req.user.phoneNumber = phoneNumber;
    let newPhoneCert = new PhoneCert();
    newPhoneCert.email = req.user.email;
    newPhoneCert.phoneNumber = phoneNumber;
    newPhoneCert.token = number;
    await newPhoneCert.save(err => {
        if (err) console.log(err);
    });
    request({
        method: method,
        json: true,
        uri: url,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'x-ncp-iam-access-key': NCP_accessKey,
            'x-ncp-apigw-timestamp': timestamp,
            'x-ncp-apigw-signature-v2': signature.toString()
        },
        body: {
            "type": "SMS",
            "contentType": "COMM",
            "countryCode": "82",
            "from": myPhoneNumber,
            "content": `리빙드로우 인증번호 ${number}입니다.`,
            "messages": [
                {
                    "to": `${phoneNumber}`,
                }
            ]
        }
    }, err => {
        if (err) console.log(err);
    });
    res.send('clear');
};

const p_submitSmsVerification = (req, res) => {
    const token = req.body.token;
    const phoneNumber = req.user.phoneNumber;
    PhoneCert.findOne({token:token,phoneNumber:phoneNumber},(err, cert) => {
       if(!cert){
           return res.send("token error");
       }
        User.update({email: req.user.email}, {
            isPhoneCert: true,
        }, err => {
            if(err)
                return res.send("updateError");
            req.user.isPhoneCert = true;
            PhoneCert.deleteOne({token:token,phoneNumber:phoneNumber},() => {});
            res.send("clear");
        });
    });
};

const p_submitAuthorRegister = async (req, res) => {
    const firstNameE = req.body.firstNameE;
    const lastNameE = req.body.lastNameE;
    const firstNameEReg = await regExpression(firstNameE,"englishOnly");
    const lastNameEReg = await regExpression(lastNameE,"englishOnly");
    if(!firstNameEReg || firstNameE.length>50 || !firstNameE) {
        return res.send("firstName Error");
    }
    if(!lastNameEReg || lastNameE.length>50 || !lastNameE) {
        return res.send("lastName Error");
    }
    if(req.user.isPhoneCert!==true) {
        return res.send("Error PhoneCert");
    }
    User.update({email: req.user.email}, {
        firstNameE: firstNameE,
        lastNameE: lastNameE
    }, err => {
        if(err) {
            console.log(err);
            return res.send("update Error");
        }
        req.user.firstNameE = firstNameE;
        req.user.lastNameE = lastNameE;
        res.send("clear");
    });
};

const p_submitAuthorUploadStudentIden = (req, res) => {
    const limitFileSize = 20000000;
    if(req.file.mimetype!=="image/jpeg"&&req.file.mimetype!=="image/jpg") {
        return res.send("error type");
    }
    if(req.file.size>limitFileSize) {
        return res.send("error size");
    }
    User.findOne({email:req.user.email}, async (err, user) => {
        if(err) console.log(err);
        await imageRemove("user/student_Iden", user.imageStudentIden.picFilename);
        User.updateOne({email:req.user.email},{imageStudentIden:{picOriginalName:req.file.originalname,picEncoding:req.file.encoding,picMimetype:req.file.mimetype,
                picDestination: req.file.destination,picFilename : req.file.filename,picPath : req.file.path,picSize : req.file.size}}, err => {
            if(err) {
                console.log(err);
                return res.send("update Error");
            }
            res.send("clear");
        });
        console.log('Some other error: ', err);
    });
};

const p_authorRegister2 = (req, res) => {
    if(!req.user.imageStudentIden.picOriginalName||req.user.isPhoneCert!==true) {
        return res.send("fail");
    }
    User.updateOne({email:req.user.email},{isSignUpSeller: true}, err => {
        if(err) return res.send("update failed");
        res.send("clear");
    });
};

module.exports.submit = submit;
module.exports.submitEnd = submitEnd;
module.exports.login = login;
module.exports.confirmCertificate = confirmCertificate;
module.exports.reMailing = reMailing;
module.exports.p_reMailing = p_reMailing;
module.exports.p_submit = p_submit;
module.exports.p_login = p_login;
module.exports.logout = logout;
module.exports.p_logout = p_logout;
module.exports.googleLogin = googleLogin;
module.exports.googleLoginCallback = googleLoginCallback;
module.exports.kakaoLogin = kakaoLogin;
module.exports.kakaoLoginCallback = kakaoLoginCallback;
module.exports.naverLogin = naverLogin;
module.exports.naverLoginCallback = naverLoginCallback;
module.exports.socialAddName = socialAddName;
module.exports.p_socialAddName = p_socialAddName;
module.exports.authorRegister = authorRegister;
module.exports.authorRegister2 = authorRegister2;
module.exports.authorRegister3 = authorRegister3;
module.exports.p_submitSmsVerificationNcpV2 = p_submitSmsVerificationNcpV2;
module.exports.p_submitSmsVerification = p_submitSmsVerification;
module.exports.p_submitAuthorRegister = p_submitAuthorRegister;
module.exports.p_submitAuthorUploadStudentIden = p_submitAuthorUploadStudentIden;
module.exports.p_authorRegister2 = p_authorRegister2;