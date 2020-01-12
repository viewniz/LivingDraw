const express = require('express');
const router = express.Router();
const controller=require('./controller');
const loginCheck=require('../../config/loginCheck');
const multer=require('multer');

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

router.get('/upload', loginCheck, loginCheck.sellerCheck, controller.upload_one);
router.get('/upload2', loginCheck, loginCheck.sellerCheck, controller.upload_two);
router.get('/upload3', loginCheck, loginCheck.sellerCheck, controller.upload_three);
router.get('/admin', loginCheck, loginCheck.sellerCheck, controller.admin_piece);
router.get('/update/:id', loginCheck, loginCheck.sellerCheck, controller.update_one);
router.get('/update2/:id', loginCheck, loginCheck.sellerCheck, controller.update_two);
router.get('/update3/:id', loginCheck, loginCheck.sellerCheck, controller.update_three);



router.post('/upload', loginCheck, loginCheck.sellerCheck, uploadPicture.single('pic'), controller.upload_one_pic_temp);
router.post('/upload1', loginCheck, loginCheck.sellerCheck, controller.upload_one_post);
router.post('/upload2', loginCheck, loginCheck.sellerCheck, controller.upload_two_post);
router.post('/upload3', loginCheck, loginCheck.sellerCheck, controller.upload_three_post);
router.post('/remove', loginCheck, loginCheck.sellerCheck, controller.admin_piece_remove_post);
router.post('/update/:id', loginCheck, loginCheck.sellerCheck, uploadPicture.single('pic'), controller.update_one_pic);
router.post('/update1/:id', loginCheck, loginCheck.sellerCheck, controller.update_one_post);
router.post('/update2/:id', loginCheck, loginCheck.sellerCheck, controller.update_two_post);
router.post('/update3/:id', loginCheck, loginCheck.sellerCheck, controller.update_three_post);

module.exports = router;
