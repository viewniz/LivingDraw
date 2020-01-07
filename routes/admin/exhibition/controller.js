const Exhibition = require('../../../models/exhibition');
const fs = require('fs');
const moment = require('moment');
require('moment-timezone');
const sharp = require('sharp');

const exhibition = (req,res) => {
    Exhibition.find({}, (err,exhibition) => {
        if(err) return console.log(err);
        res.render('admin/exhibition', {exhibition: exhibition,user:req.user});
    });
};

const exhibitionUpload = (req,res) => {
    res.render('admin/exhibition_upload_form', {user:req.user});
};

const p_exhibitionUpload = async (req,res)=>{
    let newExhibition = new Exhibition();
    newExhibition.submit_date=moment().format('YYYY-MM-DD HH:mm:ss');
    newExhibition.firstName=req.body.firstName;
    newExhibition.lastName=req.body.lastName;
    newExhibition.firstNameE=req.body.firstNameE;
    newExhibition.lastNameE=req.body.lastNameE;
    newExhibition.title=req.body.title;
    newExhibition.address=req.body.address;
    newExhibition.startDate=req.body.startDate;
    newExhibition.endDate=req.body.endDate;
    newExhibition.numberOfThings=req.body.numberOfThings;
    newExhibition.price=req.body.priceString.replace(/[^\d]+/g, '');
    newExhibition.price_string=req.body.priceString;
    newExhibition.description=req.body.description;
    let host=req.body.host.split(',');
    for(let i=0;i<host.length;i++)
    {
        newExhibition.host.push(host[i]);
    }
    const picPoster = req.files['picPosterRaw[]'];
    const picPosterRawFolder = './uploads/picPosterRaw/';
    const picPosterFolder = './uploads/picPoster/';
    const picPosterThumbFolder = './uploads/picPoster_300/';
    const picPosterWaterFolder = './uploads/picPoster_watermark/';
    const picWatermarkFolder = './uploads/watermark/watermarkImage.png';
    if(picPoster) {
        for (const pic of picPoster) {
            await sharp(picPosterRawFolder+pic.filename).rotate().toFile(picPosterFolder+pic.filename).then(
                sharp(picPosterRawFolder+pic.filename).metadata().then(metadata => {
                    return sharp(picWatermarkFolder).resize(Math.round(metadata.width/3)).webp().toBuffer();
                }).then(function(data){
                    sharp(picPosterRawFolder+pic.filename).resize(630).rotate().toFile(picPosterThumbFolder+pic.filename,(err) => {
                        if(err)
                            console.log(err);
                        else
                        {
                            sharp(picPosterRawFolder+pic.filename)
                                .composite([{ input:data, gravity: 'center'}])
                                .jpeg( { quality: 100 } ).rotate()
                                .toFile(picPosterWaterFolder+pic.filename,err => {
                                    if (err) {
                                        console.log(err);
                                    }
                                });
                        }
                    });
                })
            );
            await sharp(picPosterFolder+pic.filename).metadata().then(metadata => {
                newExhibition.image.push({picOriginalName:pic.originalname,picEncoding:pic.encoding, picMimetype:pic.mimetype, picDestination:pic.destination,
                    picFilename:pic.filename, picPath:pic.path, picSize:pic.size,
                    picWidth:metadata.width, picHeight:metadata.height});
            });
        }
    }
    const picExhibition = req.files['picExhibitionRaw[]'];
    const picExhibitionRawFolder = './uploads/picExhibitionRaw/';
    const picExhibitionFolder = './uploads/picExhibition/';
    const picExhibitionThumbFolder = './uploads/picExhibition_300/';
    const picExhibitionWaterFolder = './uploads/picExhibition_watermark/';
    if(picExhibition){
        for (const pic of picExhibition) {
            await sharp(picExhibitionRawFolder+pic.filename).rotate().toFile(picExhibitionFolder+pic.filename).then(
                sharp(picExhibitionRawFolder+pic.filename).metadata().then(function(metadata){
                    return sharp(picWatermarkFolder).resize(Math.round(metadata.width/3)).rotate().webp().toBuffer();
                }).then(function(data){
                    sharp(picExhibitionRawFolder+pic.filename).resize(630).rotate().toFile(picExhibitionThumbFolder+pic.filename,function(err, info){
                        if(err)
                            console.log(err);
                        else
                        {
                            sharp(picExhibitionRawFolder+pic.filename)
                                .composite([{ input:data, gravity: 'center'}])
                                .jpeg( { quality: 100 } ).rotate()
                                .toFile(picExhibitionWaterFolder+pic.filename,(err, info) => {
                                    if (err) {
                                        console.log(err);
                                    }
                                });
                        }
                    });
                })
            );
            await sharp(picExhibitionFolder+pic.filename).metadata().then(function(metadata){
                newExhibition.imageExhibition.push({picOriginalName:pic.originalname,picEncoding:pic.encoding, picMimetype:pic.mimetype, picDestination:pic.destination,
                    picFilename:pic.filename, picPath:pic.path, picSize:pic.size,
                    picWidth:metadata.width, picHeight:metadata.height});
            });
        }
    }
    newExhibition.uploadId=req.user.lastName+" "+req.user.firstName;
    newExhibition.save(function (err) {
        if (err)
            throw err;
        res.redirect('./upload');
    });
};

const d_exhibition= async (req,res)=>{
    Exhibition.findOne({_id:req.body.id},function (err,result) {
        if (err) console.log(err);
        const imageDestinationPoster = "./uploads/picPoster";
        const imageDestinationExhibition = "./uploads/picExhibition";
        for(let i=0;i<result.image.length;i++)
        {
            fs.stat(imageDestinationPoster+'/'+result.image[i].picFilename, (err) => {
                if(err == null) {
                    fs.unlink(imageDestinationPoster+'/'+result.image[i].picFilename, (err) => {
                        if (err) throw err;
                    });
                } else {
                    console.log('Some other error: ', err.code);
                }
            });
            fs.stat(imageDestinationPoster+'_300/'+result.image[i].picFilename, (err) => {
                if(err == null) {
                    fs.unlink(imageDestinationPoster+'_300/'+result.image[i].picFilename, (err) => {
                        if (err) throw err;
                    });
                } else {
                    console.log('Some other error: ', err.code);
                }
            });
            fs.stat(imageDestinationPoster+'_watermark/'+result.image[i].picFilename, (err) => {
                if(err == null) {
                    fs.unlink(imageDestinationPoster+'_watermark/'+result.image[i].picFilename, (err) => {
                        if (err) throw err;
                    });
                } else {
                    console.log('Some other error: ', err.code);
                }
            });
            fs.stat(imageDestinationPoster+'Raw/'+result.image[i].picFilename, (err) => {
                if(err == null) {
                    fs.unlink(imageDestinationPoster+'Raw/'+result.image[i].picFilename, (err) => {
                        if (err) throw err;
                    });
                } else {
                    console.log('Some other error: ', err.code);
                }
            });
        }
        for(let i=0;i<result.imageExhibition.length;i++)
        {
            fs.stat(imageDestinationExhibition+'/'+result.imageExhibition[i].picFilename, (err) => {
                if(err == null) {
                    fs.unlink(imageDestinationExhibition+'/'+result.imageExhibition[i].picFilename, (err) => {
                        if (err) throw err;
                    });
                } else {
                    console.log('Some other error: ', err.code);
                }
            });
            fs.stat(imageDestinationExhibition+'_300/'+result.imageExhibition[i].picFilename, (err) => {
                if(err == null) {
                    fs.unlink(imageDestinationExhibition+'_300/'+result.imageExhibition[i].picFilename, (err) => {
                        if (err) throw err;
                    });
                } else {
                    console.log('Some other error: ', err.code);
                }
            });
            fs.stat(imageDestinationExhibition+'_watermark/'+result.imageExhibition[i].picFilename, (err) => {
                if(err == null) {
                    fs.unlink(imageDestinationExhibition+'_watermark/'+result.imageExhibition[i].picFilename, (err) => {
                        if (err) throw err;
                    });
                } else {
                    console.log('Some other error: ', err.code);
                }
            });
            fs.stat(imageDestinationExhibition+'Raw/'+result.imageExhibition[i].picFilename, (err) => {
                if(err == null) {
                    fs.unlink(imageDestinationExhibition+'Raw/'+result.imageExhibition[i].picFilename, (err) => {
                        if (err) throw err;
                    });
                } else {
                    console.log('Some other error: ', err.code);
                }
            });
        }
        Exhibition.remove({_id:req.body.id}, (err) => {
            if (err) return done(err);
            res.send('clear');
        });
    });
};

module.exports.exhibition = exhibition;
module.exports.exhibitionUpload = exhibitionUpload;
module.exports.p_exhibitionUpload = p_exhibitionUpload;
module.exports.d_exhibition = d_exhibition;