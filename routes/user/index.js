let express = require('express');
let router = express.Router();
let controller=require('./controller');
let passport = require('passport');
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

router.get('/submit', controller.user_submit);
router.get('/login',controller.user_login);
router.get('/confirm_certificate/:id',controller.user_confirm_certificate);
router.get('/auth/google',controller.google_login);
router.get('/auth/google/callback',controller.google_login_callback);
router.get('/auth/kakao',controller.kakao_login);
router.get('/auth/kakao/callback',controller.kakao_login_callback);
router.get('/auth/naver',controller.naver_login);
router.get('/auth/naver/callback',controller.naver_login_callback);
router.get('/auth/social',controller.social_add_name);
router.get('/logout',controller.user_logout);
router.get('/re_mailing',controller.user_re_mailing);
router.get('/author_register',controller.author_register);
router.get('/author_register2',controller.author_register_2);
router.get('/author_register3',controller.author_register_3);
router.get('/submit/end',controller.user_submit_end);

/*POST*/

router.post('/submit',controller.user_submit_post);
router.post('/login',controller.user_login_post);
router.post('/re_mailing',controller.user_re_mailing_post);
router.post('/logout',controller.user_logout_post);
router.post('/auth/social',controller.social_add_name_post);
module.exports = router;
