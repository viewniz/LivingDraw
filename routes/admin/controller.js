let express = require('express');
let bodyParser = require('body-parser');
let fs = require('fs');
let passport = require('passport');
const sharp = require('sharp');
const jo = require('jpeg-autorotate');
const options = {quality: 85};

let moment = require('moment');
require('moment-timezone');

let app = express();

let Border = require('../../models/border');
let User = require('../../models/user');
let Admin = require('../../models/adminUser');
let Banner = require('../../models/banner');
let Box = require('../../models/box');
let Logo = require('../../models/logo');
let ogImage = require('../../models/ogImage');
const Options = require('../../models/options');
const Exhibition = require('../../models/exhibition');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

exports.admin_login_check_yes=function(req,res,next) {         //구매자 등록페이지 들어갈 때 검사
    if(!req.user)
    {
        res.redirect('/admin/login');
    }
    else if(!req.user.isAdmin)
    {
        req.logout();
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
exports.admin_submit= function(req, res, next) {
    res.render('admin/submit',{user:req.user});
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
    Options.find({type:'subject'},function (err, subject) {
        Options.find({type:'style'},function (err, style) {
            Options.find({type:'medium'},function (err, medium) {
                Options.find({type:'material'},function (err, material) {
                    Border.find(function (err, border) {
                        if(err) console.log(err);
                        res.render('admin/border',{border:border,user:req.user,subject:subject,style:style,medium:medium,material:material});
                    });
                });
            });
        });
    });
    /*Border.find(function (err, border) {
        if (err) console.log(err);
        console.log(req.user._id);
        res.render('admin/border', {border: border,user:req.user});
    });*/
};
exports.admin_user= function(req, res, next) {
    User.find(function (err, users) {
        if (err) console.log(err);
        res.render('admin/user', {users: users,user:req.user});
    });
};
exports.admin_user_permissionSeller= function(req, res, next) {
    User.find({isSignUpSeller:true, isSeller:false},function (err, users) {
        if (err) console.log(err);
        res.render('admin/user_permissionSeller', {users: users,user:req.user});
    });
};
exports.admin_user_permissionSeller_post= function(req, res, next) {
    let userNum=req.body.id;
    User.findOne({_id:userNum},function (err, user) {
        if(err){
            res.send(err);
            return;
        }
        if(!user) {
            res.send("not found user");
            return;
        }
        User.updateOne({_id:userNum}, {$set:{isSeller:true}},function(err,result){
            if(err){
                res.send(err);
                return;
            }
            res.send("clear");
        });
    });

};
exports.admin_border_upload= function(req, res, next) {
    Options.find({type:'subject'},function (err, subject) {
        Options.find({type:'style'},function (err, style) {
            Options.find({type:'medium'},function (err, medium) {
                Options.find({type:'material'},function (err, material) {
                    res.render('admin/border_upload_form', {user: req.user,subject:subject,style:style,medium:medium,material:material});
                });
            });
        });
    });
};
exports.admin_border_update= function(req, res, next) {
    let borderNum=req.params.id;
    Options.find({type:'subject'},function (err, subject) {
        Options.find({type:'style'},function (err, style) {
            Options.find({type:'medium'},function (err, medium) {
                Options.find({type:'material'},function (err, material) {
                    Border.findOne({_id:borderNum},function (err, border) {
                        if(err) console.log(err);
                        border.keyWord="";
                        for(let i=0;i<border.keyWords.length;i++)
                        {
                            border.keyWord+=border.keyWords[i]+",";
                        }
                        res.render('admin/border_update_form',{border:border,user:req.user,subject:subject,style:style,medium:medium,material:material});
                    });
                });
            });
        });
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

exports.admin_site_option_submit= function(req, res, next) {
    res.render('admin/option_submit',{user:req.user});
};

exports.admin_site_option_submit_post= function(req, res, next) {
    const type = req.body.type;
    const option = req.body.option;
    const value = req.body.value;
    const valueE = req.body.valueE;
    Options.findOne({type:type, option:option},function(err, result){
        if(err)
        {
            res.send(err);
            return;
        }
        if(result)
        {
            res.send("overlap error");
            return;
        }
        let newOption = new Options();
        newOption.type = type;
        newOption.option = option;
        newOption.value = value;
        newOption.valueE = valueE;
        newOption.save(function(err){
            if(err)
            {
                res.send(err);
                return;
            }
            res.send("clear");
        });
    });
};
exports.admin_site_option= function(req, res, next) {
    Options.find(function(err, options){
        res.render('admin/option',{options:options, user:req.user});
    });
};
exports.admin_site_option_post= function(req, res, next) {
    const id = req.body.id;
    Options.remove({_id:id}, function(err, result){
        if(err)
        {
            res.send(err);
            return;
        }
        res.send("clear");
    });
};
exports.admin_border_upload_post= async function(req, res, next) {
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
        await sharp('./uploads/picRaw/'+req.files[i].filename).rotate().toFile('./uploads/pic/'+req.files[i].filename).then(
            sharp('./uploads/picRaw/'+req.files[i].filename).metadata().then(function(metadata){
                return sharp('./uploads/watermark/watermarkImage.png').resize(Math.round(metadata.width/3)).webp().toBuffer();
            }).then(function(data){
                sharp('./uploads/picRaw/'+req.files[i].filename).resize(630).rotate().toFile('./uploads/pic_300/'+req.files[i].filename,function(err, info){
                    if(err)
                        console.log(err);
                    else
                    {
                        console.log(info);
                        sharp('./uploads/picRaw/'+req.files[i].filename)
                            .composite([{ input:data, gravity: 'center'}])
                            .jpeg( { quality: 100 } ).rotate()
                            .toFile('./uploads/pic_watermark/'+req.files[i].filename,(err, info) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log('COMPOSITE written');
                                }
                            });
                    }
                });
            })
        );
        await sharp('./uploads/picRaw/'+req.files[i].filename).metadata().then((metadata)=>{
            newBorder.image.push({picOriginalName:req.files[i].originalname,picEncoding:req.files[i].encoding, picMimetype:req.files[i].mimetype, picDestination:req.files[i].destination,
                picFilename:req.files[i].filename, picPath:req.files[i].path, picSize:req.files[i].size,
                picWidth:metadata.width, picHeight:metadata.height});
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
        const removeDestination="./uploads/pic";
        fs.stat(removeDestination+'/'+spliceResult[0].picFilename, function(err, stat) {
            if(err == null) {
                fs.unlink(removeDestination+'/'+spliceResult[0].picFilename, function(err) {
                    if (err) throw err;
                    console.log('file deleted');
                });
            } else {
                console.log('Some other error: ', err.code);
            }
        });
        fs.stat(removeDestination+'_300/'+spliceResult[0].picFilename, function(err, stat) {
            if(err == null) {
                fs.unlink(removeDestination+'_300/'+spliceResult[0].picFilename, function(err) {
                    if (err) throw err;
                    console.log('file deleted');
                });
            } else {
                console.log('Some other error: ', err.code);
            }
        });
        fs.stat(removeDestination+'_watermark/'+spliceResult[0].picFilename, function(err, stat) {
            if(err == null) {
                fs.unlink(removeDestination+'_watermark/'+spliceResult[0].picFilename, function(err) {
                    if (err) throw err;
                    console.log('file deleted');
                });
            } else {
                console.log('Some other error: ', err.code);
            }
        });
        fs.stat(removeDestination+'Raw/'+spliceResult[0].picFilename, function(err, stat) {
            if(err == null) {
                fs.unlink(removeDestination+'Raw/'+spliceResult[0].picFilename, function(err) {
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

exports.admin_border_update_post= async function(req, res, next) {
    Border.findOne({_id:req.body.id},async function (err,result) {
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
            await sharp('./uploads/picRaw/'+req.files[i].filename).rotate().toFile('./uploads/pic/'+req.files[i].filename).then(
                sharp('./uploads/picRaw/'+req.files[i].filename).metadata().then(function(metadata){
                    return sharp('./uploads/watermark/watermarkImage.png').resize(Math.round(metadata.width/3)).webp().toBuffer();
                }).then(function(data){
                    sharp('./uploads/picRaw/'+req.files[i].filename).resize(630).rotate().toFile('./uploads/pic_300/'+req.files[i].filename,function(err, info){
                        if(err)
                            console.log(err);
                        else
                        {
                            console.log(info);
                            sharp('./uploads/picRaw/'+req.files[i].filename)
                                .composite([{ input:data, gravity: 'center'}])
                                .jpeg( { quality: 100 } ).rotate()
                                .toFile('./uploads/pic_watermark/'+req.files[i].filename,(err, info) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log('COMPOSITE written');
                                    }
                                });
                        }
                    });
                })
            );
            await sharp('./uploads/picRaw/'+req.files[i].filename).metadata().then((metadata)=>{
                newBorder.image.push({picOriginalName:req.files[i].originalname,picEncoding:req.files[i].encoding, picMimetype:req.files[i].mimetype, picDestination:req.files[i].destination,
                    picFilename:req.files[i].filename, picPath:req.files[i].path, picSize:req.files[i].size,
                picWidth:metadata.width, picHeight:metadata.height});
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

exports.admin_exhibition= (req,res,next)=>{
    Exhibition.find({},(err,exhibition)=>{
        if(err){
            console.log(err);
            return;
        }
        res.render('admin/exhibition', {exhibition: exhibition,user:req.user});
    });
};

exports.admin_exhibition_upload= (req,res,next)=>{
    res.render('admin/exhibition_upload_form', {user:req.user});
};

exports.admin_exhibition_upload_post= async (req,res,next)=>{
    let newExhibition=new Exhibition();
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
    const picPoster = req.files['picPoster[]'];
    if(picPoster) {
        for(let i=0;i<picPoster.length;i++) {
            await sharp('./uploads/picPosterRaw/'+picPoster[i].filename).rotate().toFile('./uploads/picPoster/'+picPoster[i].filename).then(
                sharp('./uploads/picPosterRaw/'+picPoster[i].filename).metadata().then(function(metadata){
                    return sharp('./uploads/watermark/watermarkImage.png').resize(Math.round(metadata.width/3)).webp().toBuffer();
                }).then(function(data){
                    sharp('./uploads/picPosterRaw/'+picPoster[i].filename).resize(630).rotate().toFile('./uploads/picPoster_300/'+picPoster[i].filename,function(err, info){
                        if(err)
                            console.log(err);
                        else
                        {
                            sharp('./uploads/picPosterRaw/'+picPoster[i].filename)
                                .composite([{ input:data, gravity: 'center'}])
                                .jpeg( { quality: 100 } ).rotate()
                                .toFile('./uploads/picPoster_watermark/'+picPoster[i].filename,(err, info) => {
                                    if (err) {
                                        console.log(err);
                                    }
                                });
                        }
                    });
                })
            );
            await sharp('./uploads/picPoster/'+picPoster[i].filename).metadata().then(function(metadata){
                newExhibition.image.push({picOriginalName:picPoster[i].originalname,picEncoding:picPoster[i].encoding, picMimetype:picPoster[i].mimetype, picDestination:picPoster[i].destination,
                    picFilename:picPoster[i].filename, picPath:picPoster[i].path, picSize:picPoster[i].size,
                    picWidth:metadata.width, picHeight:metadata.height});
            });
        }
    }
    const picExhibition = req.files['picExhibition[]'];
    if(picExhibition){
        for(let i=0;i<picExhibition.length;i++) {
            await sharp('./uploads/picExhibitionRaw/'+picExhibition[i].filename).rotate().toFile('./uploads/picExhibition/'+picExhibition[i].filename).then(
                sharp('./uploads/picExhibitionRaw/'+picExhibition[i].filename).metadata().then(function(metadata){
                    return sharp('./uploads/watermark/watermarkImage.png').resize(Math.round(metadata.width/3)).rotate().webp().toBuffer();
                }).then(function(data){
                    sharp('./uploads/picExhibitionRaw/'+picExhibition[i].filename).resize(630).rotate().toFile('./uploads/picExhibition_300/'+picExhibition[i].filename,function(err, info){
                        if(err)
                            console.log(err);
                        else
                        {
                            sharp('./uploads/picExhibitionRaw/'+picExhibition[i].filename)
                                .composite([{ input:data, gravity: 'center'}])
                                .jpeg( { quality: 100 } ).rotate()
                                .toFile('./uploads/picExhibition_watermark/'+picExhibition[i].filename,(err, info) => {
                                    if (err) {
                                        console.log(err);
                                    }
                                });
                        }
                    });
                })
            );
            await sharp('./uploads/picExhibition/'+picExhibition[i].filename).metadata().then(function(metadata){
                newExhibition.imageExhibition.push({picOriginalName:picExhibition[i].originalname,picEncoding:picExhibition[i].encoding, picMimetype:picExhibition[i].mimetype, picDestination:picExhibition[i].destination,
                    picFilename:picExhibition[i].filename, picPath:picExhibition[i].path, picSize:picExhibition[i].size,
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
exports.admin_exhibition_delete_post= async (req,res,next)=>{
    Exhibition.findOne({_id:req.body.id},function (err,result) {
        if (err) console.log(err);
        const imageDestinationPoster = "./uploads/picPoster";
        const imageDestinationExhibition = "./uploads/picExhibition";
        for(let i=0;i<result.image.length;i++)
        {
            fs.stat(imageDestinationPoster+'/'+result.image[i].picFilename, function(err, stat) {
                if(err == null) {
                    fs.unlink(imageDestinationPoster+'/'+result.image[i].picFilename, function(err) {
                        if (err) throw err;
                        console.log('file deleted');
                    });
                } else {
                    console.log('Some other error: ', err.code);
                }
            });
            fs.stat(imageDestinationPoster+'_300/'+result.image[i].picFilename, function(err, stat) {
                if(err == null) {
                    fs.unlink(imageDestinationPoster+'_300/'+result.image[i].picFilename, function(err) {
                        if (err) throw err;
                        console.log('file deleted');
                    });
                } else {
                    console.log('Some other error: ', err.code);
                }
            });
            fs.stat(imageDestinationPoster+'_watermark/'+result.image[i].picFilename, function(err, stat) {
                if(err == null) {
                    fs.unlink(imageDestinationPoster+'_watermark/'+result.image[i].picFilename, function(err) {
                        if (err) throw err;
                        console.log('file deleted');
                    });
                } else {
                    console.log('Some other error: ', err.code);
                }
            });
            fs.stat(imageDestinationPoster+'Raw/'+result.image[i].picFilename, function(err, stat) {
                if(err == null) {
                    fs.unlink(imageDestinationPoster+'Raw/'+result.image[i].picFilename, function(err) {
                        if (err) throw err;
                        console.log('file deleted');
                    });
                } else {
                    console.log('Some other error: ', err.code);
                }
            });
        }
        for(let i=0;i<result.imageExhibition.length;i++)
        {
            fs.stat(imageDestinationExhibition+'/'+result.imageExhibition[i].picFilename, function(err, stat) {
                if(err == null) {
                    fs.unlink(imageDestinationExhibition+'/'+result.imageExhibition[i].picFilename, function(err) {
                        if (err) throw err;
                        console.log('file deleted');
                    });
                } else {
                    console.log('Some other error: ', err.code);
                }
            });
            fs.stat(imageDestinationExhibition+'_300/'+result.imageExhibition[i].picFilename, function(err, stat) {
                if(err == null) {
                    fs.unlink(imageDestinationExhibition+'_300/'+result.imageExhibition[i].picFilename, function(err) {
                        if (err) throw err;
                        console.log('file deleted');
                    });
                } else {
                    console.log('Some other error: ', err.code);
                }
            });
            fs.stat(imageDestinationExhibition+'_watermark/'+result.imageExhibition[i].picFilename, function(err, stat) {
                if(err == null) {
                    fs.unlink(imageDestinationExhibition+'_watermark/'+result.imageExhibition[i].picFilename, function(err) {
                        if (err) throw err;
                        console.log('file deleted');
                    });
                } else {
                    console.log('Some other error: ', err.code);
                }
            });
            fs.stat(imageDestinationExhibition+'Raw/'+result.imageExhibition[i].picFilename, function(err, stat) {
                if(err == null) {
                    fs.unlink(imageDestinationExhibition+'Raw/'+result.imageExhibition[i].picFilename, function(err) {
                        if (err) throw err;
                        console.log('file deleted');
                    });
                } else {
                    console.log('Some other error: ', err.code);
                }
            });
        }
        Exhibition.remove({_id:req.body.id},function (err, result) {
            if (err) return done(err);
            res.send('clear');
        });
    });
};