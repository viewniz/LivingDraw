const Banner = require('../../../models/banner');
const Box = require('../../../models/box');
const Logo = require('../../../models/logo');
const OgImage = require('../../../models/ogImage');
const Options = require('../../../models/options');

const banner= (req, res) => {
    res.render('admin/site_manage_banner',{user:req.user});
};

const box= (req, res) => {
    res.render('admin/site_manage_box',{user:req.user});
};

const logo= (req, res) => {
    res.render('admin/site_manage_logo',{user:req.user});
};

const ogImage= (req, res) => {
    res.render('admin/site_manage_ogImage',{user:req.user});
};
const option= (req, res) => {
    Options.find((err, options) => {
        res.render('admin/option',{options:options, user:req.user});
    });
};
const optionSubmit= (req, res) => {
    res.render('admin/option_submit',{user:req.user});
};

const p_option= (req, res) => {
    const id = req.body.id;
    Options.deleteOne({_id:id}, (err) => {
        if(err) return res.send(err);
        res.send("clear");
    });
};
const p_optionSubmit= (req, res) => {
    const type = req.body.type;
    const option = req.body.option;
    const value = req.body.value;
    const valueE = req.body.valueE;
    Options.findOne({type:type, option:option},(err, result) => {
        if(err) return res.send(err);
        if(result) return res.send("overlap error");
        let newOption = new Options();
        newOption.type = type;
        newOption.option = option;
        newOption.value = value;
        newOption.valueE = valueE;
        newOption.save((err) => {
            if(err) return res.send(err);
            res.send("clear");
        });
    });
};
const p_ogImage= (req, res) => {
    OgImage.findOne({},async (err, result) => {
        if(result)
        {
            await OgImage.deleteMany({},(err, result) => {
                if (err) console.log(err);
                console.log(result);
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
            newOgImage.save(err => {
                if (err)
                    return console.log(err);
                res.redirect("/admin/site/openGraphImage");
            });
        }
    });
};
const p_banner = (req, res) => {
    Banner.findOne({},async (err, result) => {
        if(result)
        {
            await Banner.deleteMany({}, (err, result) => {
                if (err) return console.log(err);
                console.log(result);
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
            newBanner.save(err => {
                if (err)
                    return console.log(err);
                res.redirect("/admin/site/banner");
            });
        }
    });
};

const p_box = (req, res) => {
    Box.findOne({},async (err, result) => {
        if(result)
        {
            await Box.deleteMany({},(err, result) => {
                if (err) return console.log(err);
                console.log(result);
            });
        }
        let newBox=new Box();
        newBox.uploadId=req.user.id;
        newBox.image.picOriginalName = req.file.originalname;
        newBox.image.picEncoding = req.file.encoding;
        newBox.image.picMimetype = req.file.mimetype;
        newBox.image.picDestination = req.file.destination;
        newBox.image.picFilename = req.file.filename;
        newBox.image.picPath = req.file.path;
        newBox.image.picSize = req.file.size;
        newBox.save(err => {
            if (err)
                return console.log(err);
            res.redirect("/admin/site/box");
        });
    });
};

const p_logo = (req, res) => {
    Logo.findOne({},async (err, result) => {
        if(result)
        {
            await Logo.deleteMany({},(err, result) => {
                if (err) return console.log(err);
                console.log(result);
            });
        }
        let newLogo=new Logo();
        newLogo.uploadId=req.user.id;
        newLogo.image.picOriginalName = req.file.originalname;
        newLogo.image.picEncoding = req.file.encoding;
        newLogo.image.picMimetype = req.file.mimetype;
        newLogo.image.picDestination = req.file.destination;
        newLogo.image.picFilename = req.file.filename;
        newLogo.image.picPath = req.file.path;
        newLogo.image.picSize = req.file.size;
        newLogo.save(err => {
            if (err)
                return console.log(err);
            res.redirect("/admin/site/logo");
        });
    });
};

module.exports.banner = banner;
module.exports.box = box;
module.exports.logo = logo;
module.exports.ogImage = ogImage;
module.exports.option = option;
module.exports.optionSubmit = optionSubmit;
module.exports.p_option = p_option;
module.exports.p_optionSubmit = p_optionSubmit;
module.exports.p_ogImage = p_ogImage;
module.exports.p_banner = p_banner;
module.exports.p_box = p_box;
module.exports.p_logo = p_logo;