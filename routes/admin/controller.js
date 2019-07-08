let express = require('express');
let bodyParser = require('body-parser');
let multer=require('multer');

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
    res.render('test');
};
exports.admin_border_upload= function(req, res, next) {
    res.render('admin/border_upload_form');
};
exports.admin_border_upload_post= function(req, res, next) {
    let newBorder=new Border();
    newBorder.firstName=req.body.firstName;
    newBorder.lastName=req.body.lastName;
    newBorder.title=req.body.title;
    newBorder.category=req.body.category;
    newBorder.subject=req.body.subject;
    newBorder.style=req.body.style;
    for(let i=0;i<req.body.medium.length;i++)
    {
        newBorder.medium.push(req.body.medium[i]);
    }
    for(let i=0;i<req.body.material.length;i++)
    {
        newBorder.material.push(req.body.material[i]);
    }
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