let mongoose = require('mongoose');
let moment = require('moment');
require('moment-timezone');

moment.tz.setDefault("Asia/Seoul");
let Schema = mongoose.Schema;

let BorderSchema = new Schema({
    image:[{
        picOriginalName:{type:String}, //파일 기존 이름
        picEncoding:{type:String},     //인코딩방법
        picMimetype:{type:String},      //파일 형식
        picDestination:{type:String},  //파일 경로
        picFilename:{type:String},      //파일 이름
        picPath:{type:String},          //파일 위치
        picSize:{type:String},           //파일 크기 byte 단위
        picWidth:{type:Number},
        picHeight:{type:Number}
    }],
    firstName:String,
    lastName:String,
    firstNameE:String,
    lastNameE:String,
    title:String,
    titleSub:String,
    category:String,
    subject:String,
    style:[{type:String}],
    medium:[{type:String}],
    material:[{type:String}],
    height:{type:Number},
    width:{type:Number},
    depth:{type:Number},
    size_option:{type:String},
    price:{type:Number,required: true},
    price_string:{type:String,required: true},
    keyWords:[{type:String}],
    production_year:{type:Number},
    description:String,
    deliveryHow:String,
    submit_date:{ type: String, default: moment().format('YYYY-MM-DD HH:mm:ss')},
    view:{ type: Number, default: 0},
    like:{type: Number, default: 0},
    is_selling:{type:Boolean, default: true},
    uploadId:String
});

module.exports = mongoose.model('border', BorderSchema);
