let mongoose = require('mongoose');
let moment = require('moment');
require('moment-timezone');

moment.tz.setDefault("Asia/Seoul");

let Schema = mongoose.Schema;

let UserSchema = new Schema({
    email:{type:String},
    password:{type:String},
    key:{type:String},
    firstName:{type:String},
    lastName:{type:String},
    firstNameE:{type:String},
    lastNameE:{type:String},
    submit_date:{type: String, default: moment().format('YYYY-MM-DD HH:mm:ss')},
    last_login:String,
    last_login_ip:String,
    isCertificate:{type: Boolean, default:false},
    isAdmin:{type: Boolean, default:false},
    imageFace:{
        picOriginalName:{type:String}, //파일 기존 이름
        picEncoding:{type:String},     //인코딩방법
        picMimetype:{type:String},      //파일 형식
        picDestination:{type:String},  //파일 경로
        picFilename:{type:String},      //파일 이름
        picPath:{type:String},          //파일 위치
        picSize:{type:String}           //파일 크기 byte 단위
    },
    isSeller:{type: Boolean, default:false},
    provider:{type: String, default:'local'},
    socialID:String,
});


module.exports = mongoose.model('user', UserSchema);