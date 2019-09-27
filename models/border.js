let mongoose = require('mongoose');
let moment = require('moment');
require('moment-timezone');

moment.tz.setDefault("Asia/Seoul");
let Schema = mongoose.Schema;

let BorderSchema = new Schema({
    image:[{
        picOriginalName:{type:String,required: true}, //파일 기존 이름
        picEncoding:{type:String,required: true},     //인코딩방법
        picMimetype:{type:String,required:true},      //파일 형식
        picDestination:{type:String,required:true},  //파일 경로
        picFilename:{type:String,required:true},      //파일 이름
        picPath:{type:String,required:true},          //파일 위치
        picSize:{type:String,required:true}           //파일 크기 byte 단위
    }],
    firstName:String,
    lastName:String,
    firstNameE:String,
    lastNameE:String,
    title:String,
    titleSub:String,
    category:String,
    subject:String,
    style:String,
    medium:[{type:String,required: true}],
    material:[{type:String,required: true}],
    height:{type:Number,required: true},
    width:{type:Number,required: true},
    depth:{type:Number,required: true},
    price:{type:Number,required: true},
    price_string:{type:String,required: true},
    keyWords:[{type:String}],
    production_year:{tpye:Number},
    description:String,
    deliveryHow:String,
    submit_date:{ type: String, default: moment().format('YYYY-MM-DD HH:mm:ss')},
    view:{ type: Number, default: 0},
    like:{type: Number, default: 0},
    is_selling:{type:Boolean, default: true},
    uploadId:String
});

module.exports = mongoose.model('border', BorderSchema);
