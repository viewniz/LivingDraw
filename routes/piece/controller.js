const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const sharp = require('sharp');
const app = express();
let moment = require('moment');
require('moment-timezone');

moment.tz.setDefault("Asia/Seoul");

const Border = require('../../models/border');
const Border_temp = require('../../models/border_temp');
const Options = require('../../models/options');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

exports.upload_one= function(req, res, next) {
    let picFileName = null;
    Border_temp.findOne({email:req.user.email},function (err, temp) {
       if(temp && temp.image)
           picFileName = temp.image[0].picFilename;
       res.render('piece/upload_1',{picFileName:picFileName});
    });
};
exports.upload_two= function(req, res, next) {
    Options.find({type:'subject'},function (err, subject) {
        Options.find({type:'style'},function (err, style) {
            Options.find({type:'medium'},function (err, medium) {
                Options.find({type:'material'},function (err, material) {
                    Border_temp.findOne({email:req.user.email},function (err, temp) {
                        res.render('piece/upload_2',{border:temp,subject:subject,style:style,medium:medium,material:material});
                    });
                })
            })
        })
    });
};
exports.upload_three= function(req, res, next) {
    res.render('piece/upload_3');
};

exports.admin_piece= function(req, res, next) {
    Border.find({uploadId:req.user.email},function (err, border) {
        res.render('piece/admin_piece', {border:border,user:req.user.email});
    });
};

exports.admin_piece_remove_post= function(req, res, next) {
    Border.remove({_id:req.body.id},function (err, result) {
        if(err)
        {
            res.send(err);
            return;
        }
        res.send("clear");
    });
};

exports.upload_one_pic_temp = function (req, res, next) {
    const limit = 50000000;
    if(req.file.mimetype!=="image/jpeg"&&req.file.mimetype!=="image/jpg")
    {
        res.send("error type");
        return false;
    }
    if(req.file.size>limit)
    {
        res.send("error size");
        return false;
    }
    Border_temp.findOne({email:req.user.email},function (err, temp) {
        if (err) console.log(err);
        if (!temp) {
            let border_temp = new Border_temp();
            border_temp.image.push({
                picOriginalName: req.file.originalname,
                picEncoding: req.file.encoding,
                picMimetype: req.file.mimetype,
                picDestination: req.file.destination,
                picFilename: req.file.filename,
                picPath: req.file.path,
                picSize: req.file.size
            });
            border_temp.email = req.user.email;
            sharp('./uploads/pic/' + req.file.filename).metadata().then(function (metadata) {
                return sharp('./uploads/watermark/watermarkImage.png').resize(Math.round(metadata.width / 3)).webp().toBuffer();
            }).then(function (data) {
                sharp('./uploads/pic/' + req.file.filename).resize(630).toFile('./uploads/pic_300/' + req.file.filename, function (err, info) {
                    if (err)
                        console.log(err);
                    else {
                        console.log(info);
                        sharp('./uploads/pic/' + req.file.filename)
                            .composite([{input: data, gravity: 'center'}])
                            .jpeg({quality: 100})
                            .toFile('./uploads/pic_watermark/' + req.file.filename, (err, info) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log('COMPOSITE written');
                                }
                            });
                    }
                });
            });
            border_temp.save();
            res.send("clear");
        } else {
            for(let i=0;i<temp.image.length;i++)
            {
                fs.stat(temp.image[i].picDestination + '/' + temp.image[i].picFilename, function (err, stat) {
                    if (err == null) {
                        fs.unlink(temp.image[i].picDestination + '/' + temp.image[i].picFilename, function (err) {
                            if (err) throw err;
                            console.log('file deleted');
                        });
                    } else {
                        console.log('Some other error: ', err.code);
                    }
                });
                fs.stat(temp.image[i].picDestination + '_300/' + temp.image[i].picFilename, function (err, stat) {
                    if (err == null) {
                        fs.unlink(temp.image[i].picDestination + '_300/' + temp.image[i].picFilename, function (err) {
                            if (err) throw err;
                            console.log('file deleted');
                        });
                    } else {
                        console.log('Some other error: ', err.code);
                    }
                });
                fs.stat(temp.image[i].picDestination + '_watermark/' + temp.image[i].picFilename, function (err, stat) {
                    if (err == null) {
                        fs.unlink(temp.image[i].picDestination + '_watermark/' + temp.image[i].picFilename, function (err) {
                            if (err) throw err;
                            console.log('file deleted');
                        });
                    } else {
                        console.log('Some other error: ', err.code);
                    }
                });
            }
            Border_temp.update({email: req.user.email}, {
                image: {
                    picOriginalName: req.file.originalname,
                    picEncoding: req.file.encoding,
                    picMimetype: req.file.mimetype,
                    picDestination: req.file.destination,
                    picFilename: req.file.filename,
                    picPath: req.file.path,
                    picSize: req.file.size
                }
            }, function (err, result) {
                if (err) console.log(err);
                sharp('./uploads/pic/' + req.file.filename).metadata().then(function (metadata) {
                    return sharp('./uploads/watermark/watermarkImage.png').resize(Math.round(metadata.width / 3)).webp().toBuffer();
                }).then(function (data) {
                    sharp('./uploads/pic/' + req.file.filename).resize(630).toFile('./uploads/pic_300/' + req.file.filename, function (err, info) {
                        if (err)
                            console.log(err);
                        else {
                            console.log(info);
                            sharp('./uploads/pic/' + req.file.filename)
                                .composite([{input: data, gravity: 'center'}])
                                .jpeg({quality: 100})
                                .toFile('./uploads/pic_watermark/' + req.file.filename, (err, info) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log('COMPOSITE written');
                                    }
                                });
                        }
                    });
                });
                res.send("clear");
            });
        }
    });
};

exports.upload_one_post = function (req, res, next) {
    Border_temp.findOne({email:req.user.email},function (err, temp) {
        if(!temp||!temp.image[0].picOriginalName)
        {
            res.send("fail");
            return;
        }
        res.send("clear");
    });
};

exports.upload_two_post = function (req, res, next) {
    const subject = req.body.subject;
    const style = req.body.style.split(',');
    const title = req.body.title;
    const titleSub = req.body.titleSub;
    const medium = req.body.medium.split(',');
    const material = req.body.material.split(',');
    const regType = /^[ㄱ-ㅎㅏ-ㅣ가-힣0-9:,?!()+]{1,50}$/;
    const regTypeE = /^[A-Za-z0-9:,+?!()]{1,50}$/;
    const regTypeMe = /^[A-Za-z+]{2}$/;

    if(subject==="주제선택" || !subject)
    {
        res.send("subject error");
        return false;
    }
    if(!style)
    {
        res.send("style error");
        return false;
    }
    for(let i=0;i<style.length;i++)
    {
        if(!regTypeMe.test(style[i]))
        {
            res.send("style error");
            return false;
        }
    }
    if(title==="" || !title)
    {
        res.send("title error");
        return false;
    }
    if(!regType.test(title))
    {
        res.send("title error");
        return false;
    }
    if(titleSub==="" || !titleSub)
    {
        res.send("titleSub error");
        return false;
    }
    if(!regTypeE.test(titleSub))
    {
        res.send("titleSub error");
        return false;
    }
    if(!medium)
    {
        res.send("medium error");
        return false;
    }
    for(let i=0;i<medium.length;i++)
    {
        if(!regTypeMe.test(medium[i]))
        {
            res.send("medium error");
            return false;
        }
    }
    if(!material)
    {
        res.send("material error");
        return false;
    }
    for(let i=0;i<material.length;i++)
    {
        if(!regTypeMe.test(material[i]))
        {
            res.send("material error");
            return false;
        }
    }
    Border_temp.findOne({email:req.user.email},function (err, temp) {
        if(!temp)
        {
            res.send("empty temp");
            return;
        }
        temp.subject = subject;
        temp.style = style;
        temp.title = title;
        temp.titleSub = titleSub;
        temp.medium = medium;
        temp.material = material;
        Border_temp.updateOne({email: req.user.email}, temp, function (err, result) {
            if(err)
            {
                res.send(err);
                return;
            }
            res.send("clear");
        });
    });
};

exports.upload_three_post = function (req, res, next) {
    const width = req.body.width;
    const height = req.body.height;
    const depth = req.body.depth;
    const price_string = req.body.price;
    const price= price_string.replace(/[^\d]+/g, '');
    const production_year = req.body.production_year;
    const description = req.body.description;
    const keyWords = req.body.keyWords.split(',');
    const regType = /^[ㄱ-ㅎㅏ-ㅣ가-힣A-Za-z0-9!@#$%^&*().,?;:'"~+]{0,1000}$/;
    const regTypeT = /^[ㄱ-ㅎㅏ-ㅣ가-힣A-Za-z0-9!@#$%^&*().,?;:'"~+]{1,50}$/;
    const regTypeN = /^[0-9+]{1,1000}$/;
    const subCheck1 = '$ne';
    const subCheck2 = '$lt';
    const subCheck3 = '$gt';
    const subCheck4 = '$lte';
    const subCheck5 = '$gte';
    if(!regTypeN.test(width))
    {
        res.send("width error");
        return;
    }
    if(!regTypeN.test(height))
    {
        res.send("height error");
        return;
    }
    if(!regTypeN.test(depth))
    {
        res.send("depth error");
        return;
    }
    if(!regTypeN.test(price))
    {
        res.send("price error");
        return;
    }
    if(!regTypeN.test(production_year))
    {
        res.send("production_year error");
        return;
    }
    if(!regType.test(description) || !(description.indexOf(subCheck1)===-1) || !(description.indexOf(subCheck2)===-1) || !(description.indexOf(subCheck3)===-1)
        || !(description.indexOf(subCheck4)===-1) || !(description.indexOf(subCheck5)===-1))
    {
        res.send("description error");
        return;
    }
    for (let keyword in keyWords){
        if(!regTypeT.test(keyword) || !(keyword.indexOf(subCheck1)===-1) || !(keyword.indexOf(subCheck2)===-1)
            || !(keyword.indexOf(subCheck3)===-1) || !(keyword.indexOf(subCheck4)===-1) || !(keyword.indexOf(subCheck5)===-1))
        {
            res.send("keyword error");
            return;
        }
    }
    Border_temp.findOne({email:req.user.email},function (err, temp) {
        if(err)
        {
            res.send(err);
            return;
        }
        if(!temp)
        {
            res.send("empty temp");
            return;
        }
        let tempBorder = new Border();
        tempBorder.medium = temp.medium;
        tempBorder.material = temp.material;
        tempBorder.title = temp.title;
        tempBorder.titleSub = temp.titleSub;
        tempBorder.subject = temp.subject;
        tempBorder.style = temp.style;
        tempBorder.image = temp.image;
        tempBorder.width = width;
        tempBorder.height = height;
        tempBorder.depth = depth;
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
        tempBorder.save(function (err) {
            if (err)
            {
                res.send(err);
                return;
            }
            Border_temp.remove({email: req.user.email}, function (err, result) {
                if(err)
                {
                    res.send(err);
                    return;
                }
                res.send("clear");
            });
        });
    });
};

exports.update_one= function(req, res, next) {
    const id = req.params.id;
    console.log(req.params);
    console.log(id);
    Border.findOne({_id:id},function (err, border) {
        console.log(border);
        res.render('piece/update_1',{picFileName:border.image[0].picFilename});
    });
};
exports.update_two= function(req, res, next) {
    const id = req.params.id;
    Options.find({type:'subject'},function (err, subject) {
        Options.find({type:'style'},function (err, style) {
            Options.find({type:'medium'},function (err, medium) {
                Options.find({type:'material'},function (err, material) {
                    Border.findOne({_id:id},function(err, border){
                        res.render('piece/update_2',{border:border,subject:subject,style:style,medium:medium,material:material});
                    });
                })
            })
        })
    });
};
exports.update_three= function(req, res, next) {
    const id = req.params.id;
    Border.findOne({_id:id},function(err, border){
        res.render('piece/update_3',{border:border});
    });
};

exports.update_one_pic = function (req, res, next) {
    const id = req.params.id;
    const limit = 20000000;
    if(req.file.mimetype!=="image/jpeg"&&req.file.mimetype!=="image/jpg")
    {
        res.send("error type");
        return false;
    }
    if(req.file.size>limit)
    {
        res.send("error size");
        return false;
    }
    Border.findOne({_id:id},function (err, border) {
        if (err) console.log(err);
        if (!border) {
            res.send("not exist border");
            return;
        }
        for (let i = 0; i < border.image.length; i++) {
            fs.stat(border.image[i].picDestination + '/' + border.image[i].picFilename, function (err, stat) {
                if (err == null) {
                    fs.unlink(border.image[i].picDestination + '/' + border.image[i].picFilename, function (err) {
                        if (err) throw err;
                        console.log('file deleted');
                    });
                } else {
                    console.log('Some other error: ', err.code);
                }
            });
            fs.stat(border.image[i].picDestination + '_300/' + border.image[i].picFilename, function (err, stat) {
                if (err == null) {
                    fs.unlink(border.image[i].picDestination + '_300/' + border.image[i].picFilename, function (err) {
                        if (err) throw err;
                        console.log('file deleted');
                    });
                } else {
                    console.log('Some other error: ', err.code);
                }
            });
            fs.stat(border.image[i].picDestination + '_watermark/' + border.image[i].picFilename, function (err, stat) {
                if (err == null) {
                    fs.unlink(border.image[i].picDestination + '_watermark/' + border.image[i].picFilename, function (err) {
                        if (err) throw err;
                        console.log('file deleted');
                    });
                } else {
                    console.log('Some other error: ', err.code);
                }
            });
        }
        Border.update({_id: id}, {
            image: [{
                picOriginalName: req.file.originalname,
                picEncoding: req.file.encoding,
                picMimetype: req.file.mimetype,
                picDestination: req.file.destination,
                picFilename: req.file.filename,
                picPath: req.file.path,
                picSize: req.file.size
            }]
        }, function (err, result) {
            if (err) console.log(err);
            sharp('./uploads/pic/' + req.file.filename).metadata().then(function (metadata) {
                return sharp('./uploads/watermark/watermarkImage.png').resize(Math.round(metadata.width / 3)).webp().toBuffer();
            }).then(function (data) {
                sharp('./uploads/pic/' + req.file.filename).resize(630).toFile('./uploads/pic_300/' + req.file.filename, function (err, info) {
                    if (err)
                        console.log(err);
                    else {
                        console.log(info);
                        sharp('./uploads/pic/' + req.file.filename)
                            .composite([{input: data, gravity: 'center'}])
                            .jpeg({quality: 100})
                            .toFile('./uploads/pic_watermark/' + req.file.filename, (err, info) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log('COMPOSITE written');
                                }
                            });
                    }
                });
            });
            res.send("clear");
        });
    });
};

exports.update_one_post = function (req, res, next) {
    const id = req.params.id;
    Border.findOne({_id:id},function (err, border) {
        if(!border||!border.image[0].picOriginalName)
        {
            res.send("fail");
            return;
        }
        res.send("clear");
    });
};

exports.update_two_post = function (req, res, next) {
    const id = req.params.id;
    const subject = req.body.subject;
    const style = req.body.style.split(',');
    const title = req.body.title;
    const titleSub = req.body.titleSub;
    const medium = req.body.medium.split(',');
    const material = req.body.material.split(',');
    const regType = /^[ㄱ-ㅎㅏ-ㅣ가-힣0-9:,?!()+]{1,50}$/;
    const regTypeE = /^[A-Za-z0-9:,+?!()]{1,50}$/;
    const regTypeMe = /^[A-Za-z+]{2}$/;

    if(subject==="주제선택" || !subject)
    {
        res.send("subject error");
        return false;
    }
    if(!style)
    {
        res.send("style error");
        return false;
    }
    for(let i=0;i<style.length;i++)
    {
        if(!regTypeMe.test(style[i]))
        {
            res.send("style error");
            return false;
        }
    }
    if(title==="" || !title)
    {
        res.send("title error");
        return false;
    }
    if(!regType.test(title))
    {
        res.send("title error");
        return false;
    }
    if(titleSub==="" || !titleSub)
    {
        res.send("titleSub error");
        return false;
    }
    if(!regTypeE.test(titleSub))
    {
        res.send("titleSub error");
        return false;
    }
    if(!medium)
    {
        res.send("medium error");
        return false;
    }
    for(let i=0;i<medium.length;i++)
    {
        if(!regTypeMe.test(medium[i]))
        {
            res.send("medium error");
            return false;
        }
    }
    if(!material)
    {
        res.send("material error");
        return false;
    }
    for(let i=0;i<material.length;i++)
    {
        if(!regTypeMe.test(material[i]))
        {
            res.send("material error");
            return false;
        }
    }
    Border.findOne({_id:id},function (err, border) {
        if(!border)
        {
            res.send("empty temp");
            return;
        }
        border.subject = subject;
        border.style = style;
        border.title = title;
        border.titleSub = titleSub;
        border.medium = medium;
        border.material = material;
        Border.updateOne({_id:id}, border, function (err, result) {
            if(err)
            {
                res.send(err);
                return;
            }
            res.send("clear");
        });
    });
};

exports.update_three_post = function (req, res, next) {
    const id = req.params.id;
    const width = req.body.width;
    const height = req.body.height;
    const depth = req.body.depth;
    const price_string = req.body.price;
    const production_year = req.body.production_year;
    const price= price_string.replace(/[^\d]+/g, '');
    const description = req.body.description;
    const keyWords = req.body.keyWords.split(',');
    const regType = /^[ㄱ-ㅎㅏ-ㅣ가-힣A-Za-z0-9!@#$%^&*().,?;:'"~+]{0,1000}$/;
    const regTypeT = /^[ㄱ-ㅎㅏ-ㅣ가-힣A-Za-z0-9!@#$%^&*().,?;:'"~+]{1,50}$/;
    const regTypeN = /^[0-9+]{1,1000}$/;
    const subCheck1 = '$ne';
    const subCheck2 = '$lt';
    const subCheck3 = '$gt';
    const subCheck4 = '$lte';
    const subCheck5 = '$gte';
    if(!regTypeN.test(width))
    {
        res.send("width error");
        return;
    }
    if(!regTypeN.test(height))
    {
        res.send("height error");
        return;
    }
    if(!regTypeN.test(depth))
    {
        res.send("depth error");
        return;
    }
    if(!regTypeN.test(price))
    {
        res.send("price error");
        return;
    }
    if(!regTypeN.test(production_year))
    {
        res.send("production_year error");
        return;
    }
    if(!regType.test(description) || !(description.indexOf(subCheck1)===-1) || !(description.indexOf(subCheck2)===-1) || !(description.indexOf(subCheck3)===-1)
        || !(description.indexOf(subCheck4)===-1) || !(description.indexOf(subCheck5)===-1))
    {
        res.send("description error");
        return;
    }
    for (let keyword in keyWords){
        if(!regTypeT.test(keyword) || !(keyword.indexOf(subCheck1)===-1) || !(keyword.indexOf(subCheck2)===-1)
            || !(keyword.indexOf(subCheck3)===-1) || !(keyword.indexOf(subCheck4)===-1) || !(keyword.indexOf(subCheck5)===-1))
        {
            res.send("keyword error");
            return;
        }
    }
    Border.findOne({_id:id},function (err, border) {
        if(err)
        {
            res.send(err);
            return;
        }
        if(!border)
        {
            res.send("empty temp");
            return;
        }
        border.width = width;
        border.height = height;
        border.depth = depth;
        border.price = price;
        border.price_string = price_string;
        border.description = description;
        border.keyWords = keyWords;
        border.production_year = production_year;
        Border.updateOne({_id:id}, border, function (err, result) {
            if(err)
            {
                res.send(err);
                return;
            }
            res.send("clear");
        });
    });
};