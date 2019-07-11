var express = require('express');
var app=express();
let crypto = require('crypto');
var LocalStrategy = require('passport-local').Strategy;

var AdminUser = require('../models/adminUser');

module.exports = function(passport) {
    passport.serializeUser(function (user, done) {
        done(null, {email: user.email, seller_check: user.seller_check, mid: user._id});
    });
    passport.deserializeUser(function (user, done) {

        done(null, user);
    });

    passport.use('adminSignUp', new LocalStrategy({
            usernameField: 'id',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, id, password, done) {
            console.log("디비 전");
            AdminUser.findOne({id: id}, function (err, adminAlready) {
                console.log("디비 후");
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
};