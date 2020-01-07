const multer=require('multer');

const single= (fieldName, uploadFolder) => {
    try{
        return multer({storage:
                multer.diskStorage({
                    destination: function (req, file, cb) {
                        const fixedFieldName = file.fieldname.replace(/[\[\]]+/g, '');
                        cb(null,uploadFolder+fixedFieldName);
                    },
                    filename: function (req, file, cb) {
                        cb(null,Date.now()+"!"+file.originalname);
                    }
                })
        }).single(fieldName);
    }catch(err){
        return console.log(err);
    }
};

const array= (fieldName, uploadFolder) => {
    try{
        return multer({storage:
                multer.diskStorage({
                    destination: function (req, file, cb) {
                        const fixedFieldName = file.fieldname.replace(/[\[\]]+/g, '');
                        cb(null,uploadFolder+fixedFieldName);
                    },
                    filename: function (req, file, cb) {
                        cb(null,Date.now()+"!"+file.originalname);
                    }
                })
        }).array(fieldName);
    }catch(err){
        return console.log(err);
    }
};

const fields= (fieldName, uploadFolder) => {
    try{
        return multer({storage:
                multer.diskStorage({
                    destination: function (req, file, cb) {
                        const fixedFieldName = file.fieldname.replace(/[\[\]]+/g, '');
                        cb(null,uploadFolder+fixedFieldName);
                    },
                    filename: function (req, file, cb) {
                        cb(null,Date.now()+"!"+file.originalname);
                    }
                })
        }).fields(fieldName);
    }catch(err){
        return console.log(err);
    }
};

const withExtSingle= (fieldName, fixedFileName, uploadFolder) => {
    try{
        return multer({storage:
                multer.diskStorage({
                    destination: function (req, file, cb) {
                        cb(null,uploadFolder+file.fieldname);
                    },
                    filename: function (req, file, cb) {
                        let ext=file.mimetype.split('/')[1];
                        cb(null,fixedFileName+ext);
                    }
                })
        }).single(fieldName);
    }catch(err){
        return console.log(err);
    }
};

module.exports = single;
module.exports.array = array;
module.exports.fields = fields;
module.exports.withExtSingle = withExtSingle;