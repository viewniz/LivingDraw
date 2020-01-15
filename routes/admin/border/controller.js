const moment = require('moment');
require('moment-timezone');

const Options = require('../../../models/options');
const Border = require('../../../models/border');

const imageEdit = require('../../../config/imageEdit');
const imageRemove= require('../../../config/imageRemove');

const border= async (req, res) => {
    const subject = await Options.find({type:'subject'},(err, result)=>{return result;});
    const material = await Options.find({type:'material'},(err, result)=>{return result;});
    const style = await Options.find({type:'style'},(err, result)=>{return result;});
    const medium = await Options.find({type:'medium'},(err, result)=>{return result;});

    Border.find(function (err, border) {
        if(err) console.log(err);
        res.render('admin/border',{border:border,user:req.user,subject:subject,style:style,medium:medium,material:material});
    });
};
const borderUpload= async (req, res) => {
    const subject = await Options.find({type:'subject'},(err, result)=>{return result;});
    const material = await Options.find({type:'material'},(err, result)=>{return result;});
    const style = await Options.find({type:'style'},(err, result)=>{return result;});
    const medium = await Options.find({type:'medium'},(err, result)=>{return result;});
    res.render('admin/border_upload_form', {user: req.user,subject:subject,style:style,medium:medium,material:material});

};
const borderUpdate= async (req, res) => {
    const borderNum=req.params.id;
    const subject = await Options.find({type:'subject'},(err, result)=>{return result;});
    const material = await Options.find({type:'material'},(err, result)=>{return result;});
    const style = await Options.find({type:'style'},(err, result)=>{return result;});
    const medium = await Options.find({type:'medium'},(err, result)=>{return result;});
    Border.findOne({_id:borderNum}, async (err, border) => {
        if(err) return console.log(err);
        border.keyWord="";
        for (const keyword of border.keyWords){
            border.keyWord+=keyword;
        }
        res.render('admin/border_update_form',{border:border,user:req.user,subject:subject,style:style,medium:medium,material:material});
    });
};

const p_borderUpload= async (req, res) => {
    let newBorder=new Border();
    newBorder.submit_date=moment().format('YYYY-MM-DD HH:mm:ss');
    newBorder.firstName=req.body.firstName;
    newBorder.lastName=req.body.lastName;
    newBorder.firstNameE=req.body.firstNameE;
    newBorder.lastNameE=req.body.lastNameE;
    newBorder.title=req.body.title;
    newBorder.titleSub = req.body.titleSub;
    newBorder.category = req.body.category;
    newBorder.subject = req.body.subject;
    newBorder.production_year = req.body.production_year;
    newBorder.size_option = req.body.size_option;

    if(typeof(req.body.style)!=='string')
    {
        for(let i=0;i<req.body.style.length;i++)
        {
            newBorder.style.push(req.body.style[i]);
        }
    }
    else
        newBorder.style.push(req.body.style);
    if(typeof(req.body.medium)!=='string')
    {
        for(let i=0;i<req.body.medium.length;i++)
        {
            newBorder.medium.push(req.body.medium[i]);
        }
    }
    else
        newBorder.medium.push(req.body.medium);
    if(typeof(req.body.material)!=='string')
    {
        for(let i=0;i<req.body.material.length;i++)
        {
            newBorder.material.push(req.body.material[i]);
        }
    }
    else
        newBorder.material.push(req.body.material);
    newBorder.height=req.body.height;
    newBorder.width=req.body.width;
    newBorder.depth=req.body.depth;
    newBorder.price=req.body.priceString.replace(/[^\d]+/g, '');
    newBorder.price_string=req.body.priceString;
    const keywords=req.body.keywords.split(',');
    for(let i=0;i<keywords.length;i++)
    {
        newBorder.keyWords.push(keywords[i]);
    }
    newBorder.description=req.body.description;
    for(const file of req.files){
        const pic = await imageEdit('pic', file.filename, (err,result)=>{
            if(err){
                console.log(err);
                return null;
            }
            return result;
        });
        if(pic===null){
            console.log("imageEdit error");
        }
        newBorder.image.push({picOriginalName:file.originalname,picEncoding:file.encoding, picMimetype:file.mimetype, picDestination:file.destination,
            picFilename:file.filename, picPath:file.path, picSize:file.size,
            picWidth:pic.width, picHeight:pic.height});
    }
    newBorder.uploadId=req.user.lastName+" "+req.user.firstName;
    newBorder.save(err => {
        if (err)
            throw err;
        res.redirect('./upload');
    });
};

const d_borderDelete= (req, res) => {
    Border.findOne({_id:req.body.id}, (err,result) => {
        if (err) return console.log(err);
        for(let i=0;i<result.image.length;i++)
        {
            imageRemove('pic',result.image[i].picFilename);
        }
        Border.remove({_id:req.body.id}, err => {
            if (err) return done(err);
            res.send('clear');
        });
    });
};

const p_borderIsSellingChange= (req, res) => {
    Border.findOne({_id:req.body.id}, (err,result) => {
        if (err) console.log(err);
        const isSelling = !result.is_selling;
        Border.updateOne({ _id: req.body.id }, { $set: { is_selling: isSelling } }, err => {
            if (err) {
                console.error('UpdateOne Error ', err);
                res.send('clear');
            }
        });
    });
};
const d_borderUpdateRemoveImage= (req, res) => {
    Border.findOne({_id:req.body.id}, (err,result) => {
        if (err) console.log(err);
        let spliceResult = result.image.splice(req.body.num, 1);
        imageRemove('pic',spliceResult[0].picFilename);
        Border.updateOne({ _id: req.body.id }, { $set: { image: result.image } }, err => {
            if (err) {
                console.error('UpdateOne Error ', err);
            }
            res.send('clear');
        });
    });
};

const p_borderUpdate= async (req, res) => {
    Border.findOne({_id:req.body.id}, async (err,result)=> {
        if (err) console.log(err);
        let newBorder=new Border();
        newBorder.submit_date=result.submit_date;
        newBorder._id=req.body.id;
        newBorder.is_selling=result.is_selling;
        newBorder.view=result.view;
        newBorder.like=result.like;
        newBorder.firstName=req.body.firstName;
        newBorder.lastName=req.body.lastName;
        newBorder.firstNameE=req.body.firstNameE;
        newBorder.lastNameE=req.body.lastNameE;
        newBorder.title=req.body.title;
        newBorder.titleSub=req.body.titleSub;
        newBorder.category=req.body.category;
        newBorder.subject=req.body.subject;
        newBorder.production_year=req.body.production_year;
        newBorder.size_option = req.body.size_option;
        if(typeof(req.body.style)!=='string')
        {
            for(let i=0;i<req.body.style.length;i++)
            {
                newBorder.style.push(req.body.style[i]);
            }
        }
        else
            newBorder.style.push(req.body.style);
        if(typeof(req.body.medium)!=='string')
        {
            for(let i=0;i<req.body.medium.length;i++)
            {
                newBorder.medium.push(req.body.medium[i]);
            }
        }
        else
            newBorder.medium.push(req.body.medium);
        if(typeof(req.body.material)!=='string')
        {
            for(let i=0;i<req.body.material.length;i++)
            {
                newBorder.material.push(req.body.material[i]);
            }
        }
        else
            newBorder.material.push(req.body.material);
        newBorder.height=req.body.height;
        newBorder.width=req.body.width;
        newBorder.depth=req.body.depth;
        newBorder.price=req.body.priceString.replace(/[^\d]+/g, '');
        newBorder.price_string=req.body.priceString;

        let keywords=req.body.keywords.split(',');
        for(let i=0;i<keywords.length;i++)
        {
            newBorder.keyWords.push(keywords[i]);
        }
        newBorder.description=req.body.description;
        for(let i=0;i<result.image.length;i++)
        {
            newBorder.image.push(result.image[i]);
        }
        for(const file of req.files){
            const pic = await imageEdit('pic', file.filename, (err,result)=>{
                if(err){
                    console.log(err);
                    return null;
                }
                return result;
            });
            if(pic===null){
                console.log("imageEdit error");
            }
            newBorder.image.push({picOriginalName:file.originalname,picEncoding:file.encoding, picMimetype:file.mimetype, picDestination:file.destination,
                picFilename:file.filename, picPath:file.path, picSize:file.size,
                picWidth:pic.width, picHeight:pic.height});
        }
        newBorder.uploadId=req.user.lastName+" "+req.user.firstName;
        Border.findOneAndUpdate({_id:req.body.id}, newBorder, err => {
            if (err) {
                console.error('UpdateOne Error ', err);
            }
            res.redirect('/admin/border');
        });
    });
};

module.exports.border = border;
module.exports.borderUpload = borderUpload;
module.exports.borderUpdate = borderUpdate;
module.exports.p_borderUpload = p_borderUpload;
module.exports.d_borderDelete = d_borderDelete;
module.exports.p_borderIsSellingChange = p_borderIsSellingChange;
module.exports.d_borderUpdateRemoveImage = d_borderUpdateRemoveImage;
module.exports.p_borderUpdate = p_borderUpdate;