var express = require('express');
var router = express.Router();
var controller=require('./controller');
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

router.get('/', controller.index_main);
router.get('/upload', controller.upload_one);
router.get('/upload2', controller.upload_two);
router.get('/upload3', controller.upload_three);
router.get('/admin', controller.admin_piece);

router.post('/upload',uploadPicture.single('pic'), controller.upload_one_pic_temp);
router.post('/upload1', controller.upload_one_post);
router.post('/upload2', controller.upload_two_post);
router.post('/upload3', controller.upload_three_post);

module.exports = router;
