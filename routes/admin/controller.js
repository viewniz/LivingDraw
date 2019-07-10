let express = require('express');
let bodyParser = require('body-parser');
let multer=require('multer');
var fs = require('fs');

let app = express();

let Border = require('../../models/border');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let Picture_storage=multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,'./public/img/'+file.fieldname);
    },
    filename: function (req, file, cb) {
        cb(null,Date.now()+"!"+file.originalname);
    }
});

exports.admin_main= function(req, res, next) {
    res.render('admin/index');
};
exports.admin_login= function(req, res, next) {
    res.render('admin/login');
};
exports.admin_border= function(req, res, next) {
    Border.find(function (err, border) {
        if (err) console.log(err);
        res.render('admin/border', {border: border});
    });
};
exports.admin_border_upload= function(req, res, next) {
    res.render('admin/border_upload_form');
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
        console.log(border.keyWord);
        console.log(border.keyWords);
        res.render('admin/border_update_form',{border:border});
    });

};
exports.admin_border_upload_post= function(req, res, next) {
    let newBorder=new Border();
    newBorder.firstName=req.body.firstName;
    newBorder.lastName=req.body.lastName;
    newBorder.title=req.body.title;
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
    newBorder.price=req.body.price;
    let keywords=req.body.keywords.split(',');
    for(let i=0;i<keywords.length;i++)
    {
        newBorder.keyWords.push(keywords[i]);
    }
    newBorder.description=req.body.description;
    for(let i=0;i<req.files.length;i++) {
        newBorder.image.push({picOriginalName:req.files[i].originalname,picEncoding:req.files[i].encoding, picMimetype:req.files[i].mimetype, picDestination:req.files[i].destination,
            picFilename:req.files[i].filename, picPath:req.files[i].path, picSize:req.files[i].size});
    }
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
            fs.unlink(result.image[i].picDestination+'/'+result.image[i].picFilename, function(err) {
                if (err) throw err;
                console.log('file deleted');
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