let express = require('express');
let bodyParser = require('body-parser');
let fs = require('fs');
let passport = require('passport');
const sharp = require('sharp');
let app = express();
let Border = require('../../models/border');
let Border_temp = require('../../models/border_temp');

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