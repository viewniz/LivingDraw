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
    res.render('piece/upload_2');
};
exports.upload_three= function(req, res, next) {
    res.render('piece/upload_3');
};

exports.upload_one_pic_temp = function (req, res, next) {
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

exports.upload_two_post = function (req, res, next) {
    const subject = req.body.subject;
    const style = req.body.style;
    const title = req.body.title;
    const titleSub = req.body.titleSub;
    const medium = req.body.medium.split(',');
    const material = req.body.material.split(',');
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

exports.optionUpdate = function (req, res, next) {
    let newOptions1 = new Options();
    let newOptions2 = new Options();
    let newOptions3 = new Options();
    let newOptions4 = new Options();
    let newOptions5 = new Options();
    let newOptions6 = new Options();

    newOptions1.type = "style";
    newOptions1.option = "Im";
    newOptions1.value = "인상주의";
    newOptions1.valueE = "Impressionism";
    newOptions1.save();
    newOptions2.type = "style";
    newOptions2.option = "Fi";
    newOptions2.value = "순수미술";
    newOptions2.valueE = "Fine Art";
    newOptions2.save();
    newOptions3.type = "style";
    newOptions3.option = "Ex";
    newOptions3.value = "표현주의";
    newOptions3.valueE = "Expressionism";
    newOptions3.save();
    newOptions4.type = "style";
    newOptions4.option = "Ab";
    newOptions4.value = "추상주의";
    newOptions4.valueE = "Abstract";
    newOptions4.save();
    newOptions5.type = "style";
    newOptions5.option = "Mo";
    newOptions5.value = "모더니즘";
    newOptions5.valueE = "Modern";
    newOptions5.save();
    newOptions6.type = "style";
    newOptions6.option = "Re";
    newOptions6.value = "현실주의";
    newOptions6.valueE = "Realism";
    newOptions6.save();
    res.redirect("/border");
};