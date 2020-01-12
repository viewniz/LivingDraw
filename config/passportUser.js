const crypto = require('crypto');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
const NaverStrategy = require('passport-naver').Strategy;
const User = require('../models/user');
const AdminUser = require('../models/adminUser');
const Confirm = require('./userConfirm');
const moment = require("moment");
const clientKey = require('./SecretKey');

module.exports = function(passport) {
    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });
    passport.deserializeUser(function (id, done) {
        User.findById(id, (err, user) => {
            if(!user){
                AdminUser.findById(id, (err, admin) => {
                    done(null, admin);
                });
            }
            else {
                done(null, user); // 여기의 user가 req.user가 됨
            }
        });
    });

    passport.use('signUp', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        async function (req, email, password, done) {
            if (!email) {
                return done(null, false, {message: '이메일을 입력하세요'});
            }
            if (!password) {
                return done(null, false, {message: '비밀번호를 입력하세요'});
            }
            if (!req.body.firstName) {
                return done(null, false, {message: '이름을 입력하세요'});
            }
            if (!req.body.lastName) {
                return done(null, false, {message: '성을 입력하세요'});
            }

            let checkReg = await checkRegLogin(email, password);
            if (checkReg === 1)
                return done(null, false, {message: '아이디 정규식 에러'});
            if (checkReg === 2)
                return done(null, false, {message: '비밀번호 정규식 에러'});

            let checkRegNameFirst = await checkRegName(req.body.firstName);
            let checkRegNameLast = await checkRegName(req.body.lastName);
            if (checkRegNameFirst === 1)
                return done(null, false, {message: '이름 정규식 에러'});
            if (checkRegNameLast === 1)
                return done(null, false, {message: '성 정규식 에러'});
            User.findOne({email: email}, function (err, Already) {
                if (err) return done(err);
                if (Already) {
                    return done(null, false, {message: '존재하는 아이디입니다.'});
                } else {
                    let user = new User();
                    user.firstName = req.body.firstName;
                    user.lastName = req.body.lastName;
                    user.email = email;
                    //let hashed = admin.generateHash(password);
                    crypto.randomBytes(32, function (err, buffer) {
                        //32bit 길이의 random byte 생성
                        if (err) {
                            console.log(err);
                        } else {
                            crypto.pbkdf2(password, buffer.toString('base64'), 130495, 64, 'sha512', function (err, hashed) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    user.password = (hashed.toString('base64'));
                                    user.key = buffer.toString('base64');
                                    Confirm(email, req.body.lastName + req.body.firstName);
                                    user.save(function (err) {
                                        if (err)
                                            throw err;
                                        return done(null, false, {message: 'clear'});
                                    });
                                }
                            });
                        }
                    });

                }
            });
        }
    ));
    passport.use('login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            session: true, // 세션에 저장 여부
            passReqToCallback: true
        },
        async function (req, email, password, done) {
            let checkReg = await checkRegLogin(email, password);
            if (checkReg === 1)
                return done(null, false, {message: '아이디 정규식 에러'});
            if (checkReg === 2)
                return done(null, false, {message: '비밀번호 정규식 에러'});
            User.findOne({email: email}, function (err, user) {
                if (err)
                    return done(err);
                if (!user)
                    return done(null, false, {message: '아이디 에러'});
                /*if (user.isCertificate===false)
                    return done(null, false, {message: '이메일 인증 에러'});*/
                if (user.provider !== 'local')
                    return done(null, false, {message: user.provider+' 계정으로 가입되었습니다. '+user.provider+'로 로그인 해 주세요.'});
                crypto.pbkdf2(password, user.key, 130495, 64, 'sha512', (err, hashed) => {
                    if (!(hashed.toString('base64') === user.password))
                        return done(null, false, {message: '패스워드 에러'});
                    else {
                        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                        User.updateOne({email: email}, {
                            $set: {
                                last_login: moment().format('YYYY-MM-DD HH:mm:ss'),
                                last_login_ip: ip
                            }
                        }, () => {});
                        return done(null, user);
                    }
                });
            });
        })
    );
    passport.use('google',new GoogleStrategy(
        clientKey.googleKey,function(req, accessToken, refreshToken, profile, done) {
            const provider = profile.provider;
            const email = profile.emails[0].value;
            const firstName = profile.name.givenName;
            const lastName = profile.name.familyName;
            const socialID = profile.id;

            onLoginSuccess(req, provider, email, firstName, lastName, socialID, done);
        }
    ));
    passport.use('kakao',new KakaoStrategy(
        clientKey.kakaoKey,function(req, accessToken, refreshToken, profile, done) {
            const provider = profile.provider;
            const socialID = String(profile.id);
            if(profile._json.kaccount_email)
            {
                const email = profile._json.kaccount_email;
                onLoginSuccess(req, provider, email, null, null, socialID, done);
            }
            else
            {
                onLoginSuccess(req, provider, null, null, null, socialID, done);
            }

        }
    ));
    passport.use('naver',new NaverStrategy(
        clientKey.naverKey,function(req, accessToken, refreshToken, profile, done) {
            const provider = profile.provider;
            const socialID = profile.id;
            const email = profile.emails[0].value;

            onLoginSuccess(req, provider, email, null, null, socialID, done);
        }
    ));
};

function onLoginSuccess(req, provider, email, firstName, lastName, socialID, done) {
    User.findOne({provider:provider,socialID:socialID},function (err, user) {
        if(err)
        {
            return done(err);
        }
        if(!user)
        {
            User.findOne({email:email},function (err, userOverlap) {
                if(!userOverlap)
                {
                    let newUser = new User();
                    if(firstName)
                       newUser.firstName = firstName;
                    if(lastName)
                       newUser.lastName = lastName;
                    if(email)
                       newUser.email = email;
                    newUser.socialID = socialID;
                    newUser.provider = provider;
                    newUser.isCertificate = true;
                    newUser.save(function (err,result) {
                        if(err)
                           return done(err);
                        User.findOne({provider:newUser.provider,socialID:newUser.socialID},function (err, returnUser) {
                            req.logIn(returnUser, function(err) {
                                return done(null, returnUser);
                            });
                        });
                    });
                }
                else
                {
                    console.log('message!');
                    return done(null, false, {message:'일반 계정으로 등록된 회원입니다. 일반 로그인 해 주세요.'});
                }

            });
        }
        else
        {
            req.logIn(user, function(err) {
                return done(null, user);
            });
        }
    });
}


async function checkRegLogin(id,password)
{
    const idCheck = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    const subCheck1 = '$ne';
    const subCheck2 = '$lt';
    const subCheck3 = '$gt';
    const subCheck4 = '$lte';
    const subCheck5 = '$gte';
    if(!idCheck.test(id) || !(id.indexOf(subCheck1)===-1) || !(id.indexOf(subCheck2)===-1) || !(id.indexOf(subCheck3)===-1) || !(id.indexOf(subCheck4)===-1) || !(id.indexOf(subCheck5)===-1))
    {
        return 1;
    }
    const pwCheck = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{6,24}$/;
    if(!pwCheck.test(password) || !(password.indexOf(subCheck1)===-1) || !(password.indexOf(subCheck2)===-1) || !(password.indexOf(subCheck3)===-1) || !(password.indexOf(subCheck4)===-1) || !(password.indexOf(subCheck5)===-1))
    {
        return 2;
    }
    return 3;
}

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
