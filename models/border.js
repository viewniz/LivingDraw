/**
 * Created by Sehyeon on 2017-08-03.
 */
/**
 * Created by Sehyeon on 2017-07-20.
 */
let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let BorderSchema = new Schema({
    image:[{
        image_name:{type:String,required: true},
        image_url:{type:String,required: true},   //서버상 url
        image_size:{type:String,required:true},   //사이즈 byte 단위
        image_width:{type:String,required:true},  //너비 픽셀
        image_height:{type:String,required:true}  //높이 픽셀
    }],
    artist_first:String,
    artist_last:String,
    paintName:String,
    category:String,
    width:Number,
    height:Number,
    depth:Number,
    price:{type:Number,required: true},
    deliveryHow:String,
    submit_date:{ type: Date, default: Date.now()},
    view:{ type: Number, default: 0},
    like:{type: Number, default: 0},
    description:String,
    keyWord:[{
        tag:String
    }],
    is_selling:{type:Boolean, default: false}
});

module.exports = mongoose.model('border', BorderSchema);
