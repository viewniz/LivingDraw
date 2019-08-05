let express = require('express');
let bodyParser = require('body-parser');
let multer=require('multer');
let fs = require('fs');
let passport = require('passport');
const sharp = require('sharp');
let moment = require('moment');
require('moment-timezone');

let app = express();

let Border = require('../../models/border');
let Admin = require('../../models/adminUser');
let Banner = require('../../models/banner');
let Box = require('../../models/box');
let Logo = require('../../models/logo');
let ogImage = require('../../models/ogImage');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

exports.admin_login_check_yes=function(req,res,next) {         //구매자 등록페이지 들어갈 때 검사
    if(!req.user)
    {
        res.redirect('/admin/login');
    }
    else if(!req.user.isAdmin)
    {
        res.redirect('/admin/login');
    }
    else
    {
        return next();
    }
};

exports.admin_main= function(req, res, next) {
    res.render('admin/index',{user:req.user});
};
exports.admin_submit= function(req, res, next) {sha
};
exports.admin_login= function(req, res, next) {
    res.render('admin/login');
};
exports.admin_member= function(req, res, next) {
    Admin.find(function (err, admin){
        if (err) console.log(err);
        res.render('admin/admin_member',{user:req.user,admin:admin});
    });

};
exports.admin_logout= function(req, res){
    req.logout();
    res.redirect('/admin/login');
};
exports.admin_border= function(req, res, next) {
    Border.find(function (err, border) {
        if (err) console.log(err);
        console.log(req.user._id);
        res.render('admin/border', {border: border,user:req.user});
    });
};
exports.admin_border_upload= function(req, res, next) {
    res.render('admin/border_upload_form',{user:req.user});
};
exports.admin_border_update= function(req, res, next) {
    let borderNum=req.params.id;
    Border.findOne({_id:borderNum},function (err, border) {
        if(err) console.log(err);
        border.keyWord="";
        for(let i=0;i<border.keyWords.length;i++)
        {
            border.keyWord+=border.keyWords[i]+",";
        }
        res.render('admin/border_update_form',{border:border,user:req.user});
    });

};

exports.admin_site_banner= function(req, res, next) {
    res.render('admin/site_manage_banner',{user:req.user});
};
exports.admin_site_box= function(req, res, next) {
    res.render('admin/site_manage_box',{user:req.user});
};
exports.admin_site_logo= function(req, res, next) {
    res.render('admin/site_manage_logo',{user:req.user});
};
exports.admin_site_ogImage= function(req, res, next) {
    res.render('admin/site_manage_ogImage',{user:req.user});
};
exports.admin_border_upload_post= function(req, res, next) {
    let newBorder=new Border();
    newBorder.submit_date=moment().format('YYYY-MM-DD HH:mm:ss');
    newBorder.firstName=req.body.firstName;
    newBorder.lastName=req.body.lastName;
    newBorder.firstNameE=req.body.firstNameE;
    newBorder.lastNameE=req.body.lastNameE;
    newBorder.title=req.body.title;
    newBorder.titleSub=req.body.titleSub;
    newBorder.category=req.body.category;
    newBorder.subject=req.body.subject;
    newBorder.style=req.body.style;
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
    console.log(req.body.price);
    let keywords=req.body.keywords.split(',');
    for(let i=0;i<keywords.length;i++)
    {
        newBorder.keyWords.push(keywords[i]);
    }
    newBorder.description=req.body.description;
    for(let i=0;i<req.files.length;i++) {
        newBorder.image.push({picOriginalName:req.files[i].originalname,picEncoding:req.files[i].encoding, picMimetype:req.files[i].mimetype, picDestination:req.files[i].destination,
            picFilename:req.files[i].filename, picPath:req.files[i].path, picSize:req.files[i].size});
        sharp('./uploads/pic/'+req.files[i].filename).metadata().then(function(metadata){
            return sharp('./uploads/watermark/watermarkImage.png').resize(Math.round(metadata.width/3)).webp().toBuffer();
        }).then(function(data){
            sharp('./uploads/pic/'+req.files[i].filename).resize(630).toFile('./uploads/pic_300/'+req.files[i].filename,function(err, info){
                if(err)
                    console.log(err);
                else
                {
                    console.log(info);
                    sharp('./uploads/pic/'+req.files[i].filename)
                        .composite([{ input:data, gravity: 'center'}])
                        .jpeg( { quality: 100 } )
                        .toFile('./uploads/pic_watermark/'+req.files[i].filename,(err, info) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log('COMPOSITE written');
                            }
                        });
                }
            });
        });
    }
    newBorder.uploadId=req.user.lastName+" "+req.user.firstName;
    newBorder.save(function (err) {
        if (err)
            throw err;
        res.redirect('./upload');
    });
};

exports.admin_border_delete_post= function(req, res, next) {
    Border.findOne({_id:req.body.id},function (err,result) {
        if (err) console.log(err);
        for(let i=0;i<result.image.length;i++)
        {
            fs.stat(result.image[i].picDestination+'/'+result.image[i].picFilename, function(err, stat) {
                if(err == null) {
                    fs.unlink(result.image[i].picDestination+'/'+result.image[i].picFilename, function(err) {
                        if (err) throw err;
                        console.log('file deleted');
                    });
                } else {
                    console.log('Some other error: ', err.code);
                }
            });
            fs.stat(result.image[i].picDestination+'_300/'+result.image[i].picFilename, function(err, stat) {
                if(err == null) {
                    fs.unlink(result.image[i].picDestination+'_300/'+result.image[i].picFilename, function(err) {
                        if (err) throw err;
                        console.log('file deleted');
                    });
                } else {
                    console.log('Some other error: ', err.code);
                }
            });
            fs.stat(result.image[i].picDestination+'_watermark/'+result.image[i].picFilename, function(err, stat) {
                if(err == null) {
                    fs.unlink(result.image[i].picDestination+'_watermark/'+result.image[i].picFilename, function(err) {
                        if (err) throw err;
                        console.log('file deleted');
                    });
                } else {
                    console.log('Some other error: ', err.code);
                }
            });
        }
        Border.remove({_id:req.body.id},function (err, result) {
            if (err) return done(err);
            res.send('clear');
        });
    });
};

exports.admin_border_is_selling_change= function(req, res, next) {
    Border.findOne({_id:req.body.id},function (err,result) {
        if (err) console.log(err);
        if(!result.is_selling)
        {
            Border.updateOne({ _id: req.body.id }, { $set: { is_selling: true } }, function (err, result) {
                if (err) {
                    console.error('UpdateOne Error ', err);
                    res.send('clear');
                }
            });
        }
        else
        {
            Border.updateOne({ _id: req.body.id }, { $set: { is_selling: false } }, function (err, result) {
                if (err) {
                    console.error('UpdateOne Error ', err);
                    res.send('clear');
                }
            });
        }
    });
};

exports.admin_border_update_remove_image= function(req, res, next) {
    Border.findOne({_id:req.body.id},function (err,result) {
        if (err) console.log(err);
        let spliceResult = result.image.splice(req.body.num, 1);
        fs.stat(spliceResult[0].picDestination+'/'+spliceResult[0].picFilename, function(err, stat) {
            if(err == null) {
                fs.unlink(spliceResult[0].picDestination+'/'+spliceResult[0].picFilename, function(err) {
                    if (err) throw err;
                    console.log('file deleted');
                });
            } else {
                console.log('Some other error: ', err.code);
            }
        });
        fs.stat(spliceResult[0].picDestination+'_300/'+spliceResult[0].picFilename, function(err, stat) {
            if(err == null) {
                fs.unlink(spliceResult[0].picDestination+'_300/'+spliceResult[0].picFilename, function(err) {
                    if (err) throw err;
                    console.log('file deleted');
                });
            } else {
                console.log('Some other error: ', err.code);
            }
        });
        fs.stat(spliceResult[0].picDestination+'_watermark/'+spliceResult[0].picFilename, function(err, stat) {
            if(err == null) {
                fs.unlink(spliceResult[0].picDestination+'_watermark/'+spliceResult[0].picFilename, function(err) {
                    if (err) throw err;
                    console.log('file deleted');
                });
            } else {
                console.log('Some other error: ', err.code);
            }
        });
        Border.updateOne({ _id: req.body.id }, { $set: { image: result.image } }, function (err, result) {
            if (err) {
                console.error('UpdateOne Error ', err);
            }
            res.send('clear');
        });
    });
};

exports.admin_border_update_post= function(req, res, next) {
    Border.findOne({_id:req.body.id},function (err,result) {
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
        newBorder.style=req.body.style;
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
        console.log(req.body.price);

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
        for(let i=0;i<req.files.length;i++) {
            newBorder.image.push({picOriginalName:req.files[i].originalname,picEncoding:req.files[i].encoding, picMimetype:req.files[i].mimetype, picDestination:req.files[i].destination,
                picFilename:req.files[i].filename, picPath:req.files[i].path, picSize:req.files[i].size});
            sharp('./uploads/pic/'+req.files[i].filename).metadata().then(function(metadata){
                return sharp('./uploads/watermark/watermarkImage.png').resize(Math.round(metadata.width/3)).webp().toBuffer();
            }).then(function(data){
                sharp('./uploads/pic/'+req.files[i].filename).resize(630).toFile('./uploads/pic_300/'+req.files[i].filename,function(err, info){
                    if(err)
                        console.log(err);
                    else
                    {
                        console.log(info);
                        sharp('./uploads/pic/'+req.files[i].filename)
                            .composite([{ input:data, gravity: 'center'}])
                            .jpeg( { quality: 100 } )
                            .toFile('./uploads/pic_watermark/'+req.files[i].filename,(err, info) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log('COMPOSITE written');
                                }
                            });
                    }
                });
            });
        }
        newBorder.uploadId=req.user.lastName+" "+req.user.firstName;
        Border.findOneAndUpdate({_id:req.body.id}, newBorder, function (err, result) {
            if (err) {
                console.error('UpdateOne Error ', err);
            }
            res.redirect('/admin/border');
        });
    });
};

exports.admin_submit_post= function(req, res, next) {
    passport.authenticate('adminSignUp', function(err, user, info) {
        if (err) { console.log(err); return next(err); }
        res.redirect('/admin/member');
    })(req, res, next);
};

exports.admin_login_post= function(req, res, next) {
    passport.authenticate('adminLogin', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) {res.send(info.error); }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect("/admin/border");
        });
    })(req, res, next);
};

exports.admin_delete_post= function(req, res, next) {
    Admin.findOne({_id:req.body.id},function (err,result) {
        if (err) console.log(err);
        fs.unlink(result.imageFace.picDestination+'/'+result.imageFace.picFilename, function(err) {
            if (err) throw err;
            console.log('file deleted');
        });
        Admin.remove({_id:req.body.id},function (err, result) {
            if (err) return done(err);
            res.send('clear');
        });
    });
};
exports.admin_site_ogImage_post= function(req, res, next) {
    ogImage.findOne({},function(err, result){
        if(result)
        {
            ogImage.remove({},function (err, result) {
                if (err) throw err;
                let newOgImage=new ogImage();
                newOgImage.uploadId=req.user.id;
                newOgImage.image.picOriginalName = req.file.originalname;
                newOgImage.image.picEncoding = req.file.encoding;
                newOgImage.image.picMimetype = req.file.mimetype;
                newOgImage.image.picDestination = req.file.destination;
                newOgImage.image.picFilename = req.file.filename;
                newOgImage.image.picPath = req.file.path;
                newOgImage.image.picSize = req.file.size;
                newOgImage.save(function (err) {
                    if (err)
                        throw err;
                    res.redirect("/admin/site/openGraphImage");
                });
            });
        }
        else
        {
            let newOgImage=new ogImage();
            newOgImage.uploadId=req.user.id;
            newOgImage.image.picOriginalName = req.file.originalname;
            newOgImage.image.picEncoding = req.file.encoding;
            newOgImage.image.picMimetype = req.file.mimetype;
            newOgImage.image.picDestination = req.file.destination;
            newOgImage.image.picFilename = req.file.filename;
            newOgImage.image.picPath = req.file.path;
            newOgImage.image.picSize = req.file.size;
            newOgImage.save(function (err) {
                if (err)
                    throw err;
                res.redirect("/admin/site/openGraphImage");
            });
        }
    });
};
exports.admin_site_banner_post= function(req, res, next) {
    Banner.findOne({},function(err, result){
        if(result)
        {
            Banner.remove({},function (err, result) {
                if (err) throw err;
                let newBanner=new Banner();
                newBanner.uploadId=req.user.id;
                newBanner.image.picOriginalName = req.file.originalname;
                newBanner.image.picEncoding = req.file.encoding;
                newBanner.image.picMimetype = req.file.mimetype;
                newBanner.image.picDestination = req.file.destination;
                newBanner.image.picFilename = req.file.filename;
                newBanner.image.picPath = req.file.path;
                newBanner.image.picSize = req.file.size;
                newBanner.save(function (err) {
                    if (err)
                        throw err;
                    res.redirect("/admin/site/banner");
                });
            });
        }
        else
        {
            let newBanner=new Banner();
            newBanner.uploadId=req.user.id;
            newBanner.image.picOriginalName = req.file.originalname;
            newBanner.image.picEncoding = req.file.encoding;
            newBanner.image.picMimetype = req.file.mimetype;
            newBanner.image.picDestination = req.file.destination;
            newBanner.image.picFilename = req.file.filename;
            newBanner.image.picPath = req.file.path;
            newBanner.image.picSize = req.file.size;
            newBanner.save(function (err) {
                if (err)
                    throw err;
                res.redirect("/admin/site/banner");
            });
        }
    });
};

exports.admin_site_box_post= function(req, res, next) {
    Box.findOne({},function(err, result){
        if(result)
        {
            Box.remove({},function (err, result) {
                if (err) throw err;
                let newBox=new Box();
                newBox.uploadId=req.user.id;
                newBox.image.picOriginalName = req.file.originalname;
                newBox.image.picEncoding = req.file.encoding;
                newBox.image.picMimetype = req.file.mimetype;
                newBox.image.picDestination = req.file.destination;
                newBox.image.picFilename = req.file.filename;
                newBox.image.picPath = req.file.path;
                newBox.image.picSize = req.file.size;
                newBox.save(function (err) {
                    if (err)
                        throw err;
                    res.redirect("/admin/site/box");
                });
            });
        }
        else
        {
            let newBox=new Box();
            newBox.uploadId=req.user.id;
            newBox.image.picOriginalName = req.file.originalname;
            newBox.image.picEncoding = req.file.encoding;
            newBox.image.picMimetype = req.file.mimetype;
            newBox.image.picDestination = req.file.destination;
            newBox.image.picFilename = req.file.filename;
            newBox.image.picPath = req.file.path;
            newBox.image.picSize = req.file.size;
            newBox.save(function (err) {
                if (err)
                    throw err;
                res.redirect("/admin/site/box");
            });
        }
    });
};

exports.admin_site_logo_post= function(req, res, next) {
    Logo.findOne({},function(err, result){
        if(result)
        {
            Logo.remove({},function (err, result) {
                if (err) throw err;
                let newLogo=new Logo();
                newLogo.uploadId=req.user.id;
                newLogo.image.picOriginalName = req.file.originalname;
                newLogo.image.picEncoding = req.file.encoding;
                newLogo.image.picMimetype = req.file.mimetype;
                newLogo.image.picDestination = req.file.destination;
                newLogo.image.picFilename = req.file.filename;
                newLogo.image.picPath = req.file.path;
                newLogo.image.picSize = req.file.size;
                newLogo.save(function (err) {
                    if (err)
                        throw err;
                    res.redirect("/admin/site/logo");
                });
            });
        }
        else
        {
            let newLogo=new Logo();
            newLogo.uploadId=req.user.id;
            newLogo.image.picOriginalName = req.file.originalname;
            newLogo.image.picEncoding = req.file.encoding;
            newLogo.image.picMimetype = req.file.mimetype;
            newLogo.image.picDestination = req.file.destination;
            newLogo.image.picFilename = req.file.filename;
            newLogo.image.picPath = req.file.path;
            newLogo.image.picSize = req.file.size;
            newLogo.save(function (err) {
                if (err)
                    throw err;
                res.redirect("/admin/site/logo");
            });
        }
    });
};