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

router.get('/upload', loginCheck.login_check, loginCheck.seller_check, controller.upload_one);
router.get('/upload2', loginCheck.login_check, loginCheck.seller_check, controller.upload_two);
router.get('/upload3', loginCheck.login_check, loginCheck.seller_check, controller.upload_three);
router.get('/admin', loginCheck.login_check, loginCheck.seller_check, controller.admin_piece);
router.get('/update/:id', loginCheck.login_check, loginCheck.seller_check, controller.update_one);
router.get('/update2/:id', loginCheck.login_check, loginCheck.seller_check, controller.update_two);
router.get('/update3/:id', loginCheck.login_check, loginCheck.seller_check, controller.update_three);



router.post('/upload', loginCheck.login_check, loginCheck.seller_check, uploadPicture.single('pic'), controller.upload_one_pic_temp);
router.post('/upload1', loginCheck.login_check, loginCheck.seller_check, controller.upload_one_post);
router.post('/upload2', loginCheck.login_check, loginCheck.seller_check, controller.upload_two_post);
router.post('/upload3', loginCheck.login_check, loginCheck.seller_check, controller.upload_three_post);
router.post('/remove', loginCheck.login_check, loginCheck.seller_check, controller.admin_piece_remove_post);
router.post('/update/:id', loginCheck.login_check, loginCheck.seller_check, uploadPicture.single('pic'), controller.update_one_pic);
router.post('/update1/:id', loginCheck.login_check, loginCheck.seller_check, controller.update_one_post);
router.post('/update2/:id', loginCheck.login_check, loginCheck.seller_check, controller.update_two_post);
router.post('/update3/:id', loginCheck.login_check, loginCheck.seller_check, controller.update_three_post);

module.exports = router;
