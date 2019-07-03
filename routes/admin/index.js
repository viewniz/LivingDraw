let express = require('express');
let router = express.Router();
let controller=require('./controller');
let multer=require('multer');

let Picture_storage=multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,'./uploads/'+file.fieldname);
    },
    filename: function (req, file, cb) {
        cb(null,Date.now()+"!"+file.originalname);
    }
});
let uploadPicture=multer({storage:Picture_storage});


/* GET users listing. */

router.get('/', controller.admin_main);
router.get('/login', controller.admin_login);
router.get('/border', controller.admin_border);
router.get('/border/insert', controller.admin_border_insert);
router.post('/border/upload', uploadPicture.array('pic'), controller.admin_border_upload);
module.exports = router;
