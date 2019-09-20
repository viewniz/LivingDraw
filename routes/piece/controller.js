const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const sharp = require('sharp');
const app = express();
const Border_temp = require('../../models/border_temp');
const Options = require('../../models/options');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

exports.index_main= function(req, res, next) {
    res.render('index/index');
};

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
                    res.render('piece/upload_2',{subject:subject,style:style,medium:medium,material:material});
                })
            })
        })
    });
};
exports.upload_three= function(req, res, next) {
    res.render('piece/upload_3');
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
    const style = req.body.style;
    const title = req.body.title;
    const titleSub = req.body.titleSub;
    const medium = req.body.medium.split(',');
    const material = req.body.material.split(',');
    const regType = /^[ㄱ-ㅎㅏ-ㅣ가-힣+]{1,50}$/;
    const regTypeE = /^[A-Za-z+]{1,50}$/;
    const regTypeMe = /^[A-Za-z+]{2}$/;

    if(subject==="주제선택" || !subject)
    {
        res.send("subject error");
        return false;
    }
    if(style==="스타일선택" || !style)
    {
        res.send("style error");
        return false;
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
    const price = req.body.price;
    const description = req.body.description;
    const keyWords = req.body.keyWords.split(',');
    Border_temp.findOne({email:req.user.email},function (err, temp) {
        if(!temp)
        {
            res.send("empty temp");
            return;
        }
        temp.width = width;
        temp.height = height;
        temp.depth = depth;
        temp.price = price;
        temp.description = description;
        temp.keyWords = keyWords;
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

exports.optionUpdate = function (req, res, next) {
    let newOptions1 = new Options();
    let newOptions2 = new Options();
    let newOptions3 = new Options();
    let newOptions4 = new Options();
    let newOptions5 = new Options();
    let newOptions6 = new Options();
    newOptions5.type = "material";
    newOptions5.option = "Wo";
    newOptions5.value = "나무";
    newOptions5.valueE = "Wood";
    newOptions5.save();
    newOptions6.type = "material";
    newOptions6.option = "Pa";
    newOptions6.value = "종이";
    newOptions6.valueE = "Paper";
    newOptions6.save();
    /*
    option(value="Pa") 종이
    //Paper
    option(value="Wo") 나무
    //Wood*/

    res.redirect("/border");
};