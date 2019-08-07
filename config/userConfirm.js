const crypto = require('crypto');
const Certification = require('../models/certification');
let moment = require('moment');
require('moment-timezone');
const mailer=require('./mailer');
moment.tz.setDefault("Asia/Seoul");

module.exports = function (email,name) {
    let cert=new Certification();
    cert.email=email;
    const cipherKey=crypto.randomBytes(32);
    const cipherIV=crypto.randomBytes(16);
    let cipher = crypto.createCipheriv('aes-256-cbc', cipherKey, cipherIV);    // Cipher 객체 생성
    cipher.update(email, 'utf8', 'hex');             // 인코딩 방식에 따라 암호화
    cert.token = cipher.final('hex');
    cert.iv=cipherIV;
    mailer(email,cert.token,name);
    cert.save(function (err) {
        if (err)
            throw err;
    });
};