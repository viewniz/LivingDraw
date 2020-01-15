const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

const Border = require('../../models/border');
const Border_temp = require('../../models/border_temp');
const Options = require('../../models/options');

const regExpression = require('../../config/regExpression');
const imageEdit = require('../../config/imageEdit');
const imageRemove = require('../../config/imageRemove');

const upload1= (req, res) => {
    let picFileName = null;
    Border_temp.findOne({email:req.user.email}, (err, temp) => {
       if(temp && temp.image)
           picFileName = temp.image[0].picFilename;
       res.render('piece/upload_1',{picFileName:picFileName});
    });
};
const upload2= async (req, res) => {
    const subject = await Options.find({type:'subject'},(err, result)=> result);
    const material = await Options.find({type:'material'},(err, result)=> result);
    const style = await Options.find({type:'style'},(err, result)=> result);
    const medium = await Options.find({type:'medium'},(err, result)=> result);
    Border_temp.findOne({email:req.user.email}, (err, temp) => {
        res.render('piece/upload_2',{border:temp,subject:subject,style:style,medium:medium,material:material});
    });

};
const upload3= (req, res) => {
    res.render('piece/upload_3');
};

const piece= (req, res) => {
    Border.find({uploadId:req.user.email}, (err, border) => {
        res.render('piece/admin_piece', {border:border,user:req.user.email});
    });
};

const d_piece= (req, res) => {
    Border.remove({_id:req.body.id}, err => {
        if(err) {
            return res.send(err);
        }
        res.send("clear");
    });
};

const p_upload1PicTemp = (req, res) => {
    const limit = 50000000;

    if(req.file.mimetype!=="image/jpeg"&&req.file.mimetype!=="image/jpg")
        return res.send("error type");
    if(req.file.size>limit)
        return res.send("error size");

    Border_temp.findOne({email:req.user.email}, async (err, temp) => {
        if (err) console.log(err);
        if (temp) {
            for(let i=0;i<temp.image.length;i++)
            {
                imageRemove("pic", temp.image[i].picFilename,()=>{});
            }
        }
        const pic = await imageEdit("pic",req.file.filename,()=>{});
        let border_temp = new Border_temp();
        border_temp.email = req.user.email;
        border_temp.image.push({
            picOriginalName: req.file.originalname,
            picEncoding: req.file.encoding,
            picMimetype: req.file.mimetype,
            picDestination: req.file.destination,
            picFilename: req.file.filename,
            picPath: req.file.path,
            picSize: req.file.size,
            picWidth: pic.width,
            picHeight: pic.height
        });
        border_temp.save();
        res.send("clear");
    });
};

const p_upload1 = (req, res) => {
    Border_temp.findOne({email:req.user.email}, (err, temp) => {
        if(!temp||!temp.image[0].picOriginalName)
            return res.send("fail");
        res.send("clear");
    });
};

const p_upload2 = (req, res) => {
    const subject = req.body.subject;
    const style = req.body.style.split(',');
    const title = req.body.title;
    const titleSub = req.body.titleSub;
    const medium = req.body.medium.split(',');
    const material = req.body.material.split(',');

    if(subject==="주제선택" || !subject)
        return res.send("subject error");
    if(!style)
        return res.send("style error");
    for(let i=0;i<style.length;i++) {
        if(!regExpression(style[i],"englishOnly"))
            return res.send("style error");
    }
    if(title==="" || !title || !regExpression(title))
        return res.send("title error");
    if(titleSub==="" || !titleSub || !regExpression(titleSub,"english"))
        return res.send("titleSub error");
    if(!medium)
        return res.send("medium error");
    for(let i=0;i<medium.length;i++)
    {
        if(!regExpression(medium[i],"englishOnly"))
            return res.send("medium error");
    }
    if(!material)
        return res.send("material error");
    for(let i=0;i<material.length;i++)
    {
        if(!regExpression(material[i],"englishOnly"))
            return res.send("material error");
    }
    Border_temp.findOne({email:req.user.email}, (err, temp) => {
        if(!temp)
            return res.send("empty temp");
        temp.subject = subject;
        temp.style = style;
        temp.title = title;
        temp.titleSub = titleSub;
        temp.medium = medium;
        temp.material = material;
        Border_temp.updateOne({email: req.user.email}, temp, err => {
            if(err)
                return res.send(err);
            res.send("clear");
        });
    });
};

const p_upload3 = (req, res) => {
    const width = req.body.width;
    const height = req.body.height;
    const depth = req.body.depth;
    const price_string = req.body.price;
    const price= price_string.replace(/[^\d]+/g, '');
    const production_year = req.body.production_year;
    const size_option = req.body.size_option;
    const description = req.body.description;
    const keyWords = req.body.keyWords.split(',');

    if(!regExpression(width,"number"))
        return res.send("width error");
    if(!regExpression(height,"number"))
        return res.send("height error");
    if(!regExpression(depth,"number"))
        return res.send("depth error");
    if(!price || !regExpression(price,"number"))
        return res.send("price error");
    if(!production_year || !regExpression(production_year,"number"))
        return res.send("production_year error");
    if(!regExpression(size_option))
        return res.send("size_option error");
    if(!regExpression(description))
        return res.send("description error");
    for (let keyword of keyWords){
        if(!regExpression(keyword))
            return res.send("keyword error");
    }
    Border_temp.findOne({email:req.user.email}, (err, temp) => {
        if(err)
            return res.send(err);
        if(!temp)
            return res.send("empty temp");
        let tempBorder = new Border();
        tempBorder.subject = temp.subject;
        tempBorder.style = temp.style;
        tempBorder.title = temp.title;
        tempBorder.titleSub = temp.titleSub;
        tempBorder.medium = temp.medium;
        tempBorder.material = temp.material;
        tempBorder.image = temp.image;
        tempBorder.width = width;
        tempBorder.height = height;
        tempBorder.depth = depth;
        tempBorder.size_option = size_option;
        tempBorder.price = price;
        tempBorder.price_string = price_string;
        tempBorder.production_year = production_year;
        tempBorder.description = description;
        tempBorder.keyWords = keyWords;
        tempBorder.firstName = req.user.firstName;
        tempBorder.firstNameE = req.user.firstNameE;
        tempBorder.lastName = req.user.lastName;
        tempBorder.lastNameE = req.user.lastNameE;
        tempBorder.uploadId = req.user.email;
        tempBorder.save( err => {
            if (err)
                return res.send(err);
            Border_temp.remove({email: req.user.email}, err => {
                if(err)
                    return res.send(err);
                res.send("clear");
            });
        });
    });
};

const update1= (req, res) => {
    const id = req.params.id;
    Border.findOne({_id:id},function (err, border) {
        res.render('piece/update_1',{picFileName:border.image[0].picFilename});
    });
};
const update2= async (req, res) => {
    const id = req.params.id;
    const subject = await Options.find({type:'subject'},(err, result)=> result);
    const material = await Options.find({type:'material'},(err, result)=> result);
    const style = await Options.find({type:'style'},(err, result)=> result);
    const medium = await Options.find({type:'medium'},(err, result)=> result);
    Border.findOne({_id:id},function(err, border){
        res.render('piece/update_2',{border:border,subject:subject,style:style,medium:medium,material:material});
    });
};
const update3= (req, res) => {
    const id = req.params.id;
    Border.findOne({_id:id}, (err, border) => {
        res.render('piece/update_3',{border:border});
    });
};

const put_update1Pic = (req, res) => {
    const id = req.params.id;
    const limit = 20000000;
    if(req.file.mimetype!=="image/jpeg"&&req.file.mimetype!=="image/jpg")
        return res.send("error type");
    if(req.file.size>limit)
        return res.send("error size");
    Border.findOne({_id:id}, async (err, border) => {
        if (err) return console.log(err);
        if (!border)
            return res.send("not exist border");
        for (let i = 0; i < border.image.length; i++) {
            imageRemove("pic", border.image[i].picFilename,()=>{});
        }
        const pic = await imageEdit("pic",req.file.filename,()=>{});
        Border.update({_id: id}, {
            image: [{
                picOriginalName: req.file.originalname,
                picEncoding: req.file.encoding,
                picMimetype: req.file.mimetype,
                picDestination: req.file.destination,
                picFilename: req.file.filename,
                picPath: req.file.path,
                picSize: req.file.size,
                picWidth: pic.width,
                picHeight: pic.Height
            }]
        },err=>{
            if(err) return res.send("update err");
            res.send("clear");
        });
    });
};

const put_update1 = (req, res) => {
    const id = req.params.id;
    Border.findOne({_id:id}, (err, border) => {
        if(!border||!border.image[0].picOriginalName)
            return res.send("fail");
        res.send("clear");
    });
};

const put_update2 = (req, res) => {
    const id = req.params.id;
    const subject = req.body.subject;
    const style = req.body.style.split(',');
    const title = req.body.title;
    const titleSub = req.body.titleSub;
    const medium = req.body.medium.split(',');
    const material = req.body.material.split(',');

    if(subject==="주제선택" || !subject)
        return res.send("subject error");
    if(!style)
        return res.send("style error");
    for(let i=0;i<style.length;i++)
    {
        if(!regExpression(style[i], "englishOnly"))
            return res.send("style error");
    }
    if(title==="" || !title || !regExpression(title))
        return res.send("title error");
    if(titleSub==="" || !titleSub || !regExpression(titleSub,"english"))
        return res.send("titleSub error");
    if(!medium)
        return res.send("medium error");
    for(let i=0;i<medium.length;i++)
    {
        if(!regExpression(medium[i], "englishOnly"))
            return res.send("medium error");
    }
    if(!material)
        return res.send("material error");
    for(let i=0;i<material.length;i++)
    {
        if(!regExpression(material[i], "englishOnly"))
            return res.send("material error");
    }
    Border.findOne({_id:id}, (err, border) => {
        if(err||!border)
            return res.send("empty temp");
        border.subject = subject;
        border.style = style;
        border.title = title;
        border.titleSub = titleSub;
        border.medium = medium;
        border.material = material;
        Border.updateOne({_id:id}, border, err => {
            if(err)
                return res.send(err);
            res.send("clear");
        });
    });
};

const put_update3 = (req, res) => {
    const id = req.params.id;
    const width = req.body.width;
    const height = req.body.height;
    const depth = req.body.depth;
    const size_option = req.body.size_option;
    const price_string = req.body.price;
    const production_year = req.body.production_year;
    const price= price_string.replace(/[^\d]+/g, '');
    const description = req.body.description;
    const keyWords = req.body.keyWords.split(',');
    if(!regExpression(width,"number"))
        return res.send("width error");
    if(!regExpression(height,"number"))
        return res.send("height error");
    if(!regExpression(depth,"number"))
        return res.send("depth error");
    if(!price || !regExpression(price,"number"))
        return res.send("price error");
    if(!production_year || !regExpression(production_year,"number"))
        return res.send("production_year error");
    if(!regExpression(size_option))
        return res.send("size_option error");
    if(!regExpression(description))
        return res.send("description error");
    for (let keyword of keyWords){
        if(!regExpression(keyword))
            return res.send("keyword error");
    }
    Border.findOne({_id:id}, (err, border) => {
        if(err)
            return res.send(err);
        if(!border)
            return res.send("empty temp");
        border.width = width;
        border.height = height;
        border.depth = depth;
        border.size_option = size_option;
        border.price = price;
        border.price_string = price_string;
        border.description = description;
        border.keyWords = keyWords;
        border.production_year = production_year;
        Border.updateOne({_id:id}, border, err => {
            if(err)
                return res.send(err);
            res.send("clear");
        });
    });
};

module.exports = piece;
module.exports.d_piece = d_piece;
module.exports.upload1 = upload1;
module.exports.upload2 = upload2;
module.exports.upload3 = upload3;
module.exports.p_upload1PicTemp = p_upload1PicTemp;
module.exports.p_upload1 = p_upload1;
module.exports.p_upload2 = p_upload2;
module.exports.p_upload3 = p_upload3;
module.exports.update1 = update1;
module.exports.update2 = update2;
module.exports.update3 = update3;
module.exports.put_update1Pic = put_update1Pic;
module.exports.put_update1 = put_update1;
module.exports.put_update2 = put_update2;
module.exports.put_update3 = put_update3;