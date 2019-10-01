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
router.get('/update/:id', controller.update_one);
router.get('/update2/:id', controller.update_two);
router.get('/update3/:id', controller.update_three);



router.post('/upload',uploadPicture.single('pic'), controller.upload_one_pic_temp);
router.post('/upload1', controller.upload_one_post);
router.post('/upload2', controller.upload_two_post);
router.post('/upload3', controller.upload_three_post);
router.post('/remove', controller.admin_piece_remove_post);
router.post('/update/:id',uploadPicture.single('pic'), controller.update_one_pic);
router.post('/update1/:id', controller.update_one_post);
router.post('/update2/:id', controller.update_two_post);
router.post('/update3/:id', controller.update_three_post);

module.exports = router;
