const Exhibition = require('../../../models/exhibition');
const moment = require('moment');
require('moment-timezone');

const imageEdit = require('../config/imageEdit');
const imageRemove= require('../../../config/imageRemove');

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
    if(picPoster) {
        for (const pic of picPoster) {
            const picWH = await imageEdit('picPoster', pic.filename, (err,result)=>{
                if(err){
                    console.log(err);
                    return null;
                }
                return result;
            });
            newExhibition.image.push({picOriginalName:pic.originalname,picEncoding:pic.encoding, picMimetype:pic.mimetype, picDestination:pic.destination,
                picFilename:pic.filename, picPath:pic.path, picSize:pic.size,
                picWidth:picWH.width, picHeight:picWH.height});
        }
    }
    const picExhibition = req.files['picExhibitionRaw[]'];
    if(picExhibition){
        for (const pic of picExhibition) {
            const picWH = await imageEdit('picExhibition', pic.filename, (err,result)=>{
                if(err){
                    console.log(err);
                    return null;
                }
                return result;
            });
            newExhibition.imageExhibition.push({picOriginalName:pic.originalname,picEncoding:pic.encoding, picMimetype:pic.mimetype, picDestination:pic.destination,
                picFilename:pic.filename, picPath:pic.path, picSize:pic.size,
                picWidth:picWH.width, picHeight:picWH.height});
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
        if (err) return console.log(err);
        for(let i=0;i<result.image.length;i++)
        {
            imageRemove('picPoster',result.image[i].picFilename);
        }
        for(let i=0;i<result.imageExhibition.length;i++)
        {
            imageRemove('picExhibition',result.imageExhibition[i].picFilename);
        }
        Exhibition.deleteOne({_id:req.body.id}, (err) => {
            if (err) return done(err);
            res.send('clear');
        });
    });
};

module.exports.exhibition = exhibition;
module.exports.exhibitionUpload = exhibitionUpload;
module.exports.p_exhibitionUpload = p_exhibitionUpload;
module.exports.d_exhibition = d_exhibition;