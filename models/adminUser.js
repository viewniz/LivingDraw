let mongoose = require('mongoose');
let crypto = require('crypto');
let moment = require('moment');
require('moment-timezone');

moment.tz.setDefault("Asia/Seoul");

let Schema = mongoose.Schema;

let AdminUserSchema = new Schema({
    id:{type:String},
    password:{type:String},
    key:{type:String},
    firstName:{type:String},
    lastName:{type:String},
    submit_date:{type: Date, default: moment().format('YYYY-MM-DD HH:mm:ss')},
    last_login:Date,
    last_login_ip:String,
    imageFace:{
        picOriginalName:{type:String,required: true}, //파일 기존 이름
        picEncoding:{type:String,required: true},     //인코딩방법
        picMimetype:{type:String,required:true},      //파일 형식
        picDestination:{type:String,required:true},  //파일 경로
        picFilename:{type:String,required:true},      //파일 이름
        picPath:{type:String,required:true},          //파일 위치
        picSize:{type:String,required:true}           //파일 크기 byte 단위
    },
});
AdminUserSchema.methods.generateHash = function(password){

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
                    let a={passwordHashed: (hashed.toString('base64')), key: buffer.toString('base64')};
                    console.log("여기까지 됐어!");
                    console.log(a);
                    return a;
                }
            });
        }
    });
};

AdminUserSchema.methods.validPassWord = function (password) {
    crypto.pbkdf2(password.string, password.key, 130495, 64, 'sha512', (err, key) => {
        return (key.toString('base64') === password.passwordHashed);
    });
};

module.exports = mongoose.model('adminUser', AdminUserSchema);