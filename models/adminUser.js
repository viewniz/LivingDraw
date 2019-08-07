let mongoose = require('mongoose');
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
    submit_date:{type: String, default: moment().format('YYYY-MM-DD HH:mm:ss')},
    last_login:String,
    last_login_ip:String,
    isAdmin:{type: Boolean, default:true},
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

module.exports = mongoose.model('adminUser', AdminUserSchema);