var express = require('express');
var app=express();
let crypto = require('crypto');
var LocalStrategy = require('passport-local').Strategy;

var AdminUser = require('../models/adminUser');
const moment = require("moment");

module.exports = function(passport) {
    passport.serializeUser(function (admin, done) {
        done(null, admin._id);
    });
    passport.deserializeUser(function (id, done) {
        AdminUser.findById(id, (err, admin) => {
            done(null, admin); // 여기의 user가 req.user가 됨
        });
    });

    passport.use('adminSignUp', new LocalStrategy({
            usernameField: 'id',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, id, password, done) {
            AdminUser.findOne({id: id}, function (err, adminAlready) {
                if (err) return done(err);
                if (adminAlready) {
                    return done(null, false, {error: '존재하는 아이디입니다.'});
                } else {
                    let admin = new AdminUser();
                    admin.firstName = req.body.firstName;
                    admin.lastName = req.body.lastName;
                    admin.id = id;
                    //let hashed = admin.generateHash(password);
                    crypto.randomBytes(32, function(err, buffer){
                        //32bit 길이의 random byte 생성
                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {
                            crypto.pbkdf2(password, buffer.toString('base64'), 130495, 64, 'sha512', function(err, hashed) {
                                if(err)
                                {
                                    console.log(err);
                                }
                                else
                                {
                                    admin.password = (hashed.toString('base64'));
                                    admin.key = buffer.toString('base64');
                                    admin.imageFace.picOriginalName = req.file.originalname;
                                    admin.imageFace.picEncoding = req.file.encoding;
                                    admin.imageFace.picMimetype = req.file.mimetype;
                                    admin.imageFace.picDestination = req.file.destination;
                                    admin.imageFace.picFilename = req.file.filename;
                                    admin.imageFace.picPath = req.file.path;
                                    admin.imageFace.picSize = req.file.size;
                                    admin.save(function (err) {
                                        if (err)
                                            throw err;
                                        return done(null, false, {error: 'clear'});
                                    });
                                }
                            });
                        }
                    });

                }
            });
        }
    ));
    passport.use('adminLogin', new LocalStrategy({
            usernameField: 'id',
            passwordField: 'password',
            session: true, // 세션에 저장 여부
            passReqToCallback: true
        },
        function (req, id, password, done) {
            const idCheck = /^[a-z0-9]+[a-z0-9]{6,24}$/g;
            const subCheck1 = '$ne';
            const subCheck2 = '$lt';
            const subCheck3 = '$gt';
            const subCheck4 = '$lte';
            const subCheck5 = '$gte';
            if(!idCheck.test(id) || !(id.indexOf(subCheck1)===-1) || !(id.indexOf(subCheck2)===-1) || !(id.indexOf(subCheck3)===-1) || !(id.indexOf(subCheck4)===-1) || !(id.indexOf(subCheck5)===-1))
            {
                return done(null, false, {error: '아이디 에러reg'});
            }
            const pwCheck = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{6,24}$/;
            if(!pwCheck.test(password) || !(password.indexOf(subCheck1)===-1) || !(password.indexOf(subCheck2)===-1) || !(password.indexOf(subCheck3)===-1) || !(password.indexOf(subCheck4)===-1) || !(password.indexOf(subCheck5)===-1))
            {
                return done(null, false, {error: '패스워드 에러reg'});
            }
            AdminUser.findOne({id: id}, function (err, admin) {
                if (err)
                    return done(err);
                if (!admin)
                    return done(null, false, {error: '아이디 에러'});
                crypto.pbkdf2(password, admin.key, 130495, 64, 'sha512', (err, hashed) => {
                    if(!(hashed.toString('base64') === admin.password))
                        return done(null, false, {error: '패스워드 에러'});
                    else
                    {
                        const ip = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress;
                        AdminUser.update({id:id},{$set:{last_login:moment().format('YYYY-MM-DD HH:mm:ss'),last_login_ip:ip}},function(){});
                        return done(null, admin);
                    }
                });
            });
        })
    );
};