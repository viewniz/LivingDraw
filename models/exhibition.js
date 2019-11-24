const mongoose = require('mongoose');
const moment = require('moment');
require('moment-timezone');

moment.tz.setDefault("Asia/Seoul");
const Schema = mongoose.Schema;

let ExhibitionSchema = new Schema({
    image:[{
        picOriginalName:{type:String,required: true}, //파일 기존 이름
        picEncoding:{type:String,required: true},     //인코딩방법
        picMimetype:{type:String,required:true},      //파일 형식
        picDestination:{type:String,required:true},  //파일 경로
        picFilename:{type:String,required:true},      //파일 이름
        picPath:{type:String,required:true},          //파일 위치
        picSize:{type:String,required:true},           //파일 크기 byte 단위
        picWidth:{type:Number},
        picHeight:{type:Number}
    }],
    imageExhibition:[{
        picOriginalName:{type:String,required: true}, //파일 기존 이름
        picEncoding:{type:String,required: true},     //인코딩방법
        picMimetype:{type:String,required:true},      //파일 형식
        picDestination:{type:String,required:true},  //파일 경로
        picFilename:{type:String,required:true},      //파일 이름
        picPath:{type:String,required:true},          //파일 위치
        picSize:{type:String,required:true},        //파일 크기 byte 단위
        picWidth:{type:Number},
        picHeight:{type:Number}
    }],
    startDate:String,
    endDate:String,
    address:String,
    firstName:String,
    lastName:String,
    firstNameE:String,
    lastNameE:String,
    title:String,
    numberOfThings:Number,
    price:{type:Number,required: true},
    price_string:{type:String,required: true},
    description:String,
    host:[{type:String}],
    submit_date:{ type: String, default: moment().format('YYYY-MM-DD HH:mm:ss')},
    view:{ type: Number, default: 0},
    uploadId:String
});

module.exports = mongoose.model('exhibition', ExhibitionSchema);
