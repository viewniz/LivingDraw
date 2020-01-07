const fs = require('fs');
const passport = require('passport');
const sharp = require('sharp');
const jo = require('jpeg-autorotate');
const options = {quality: 85};

const moment = require('moment');
require('moment-timezone');

const Border = require('../../models/border');
const User = require('../../models/user');
const Admin = require('../../models/adminUser');
const Options = require('../../models/options');
const Exhibition = require('../../models/exhibition');

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

exports.admin_border_upload_post= async function(req, res, next) {
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