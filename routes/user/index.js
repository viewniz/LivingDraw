let express = require('express');
let router = express.Router();
const controller=require('./controller');
const loginCheck=require('../../config/loginCheck');
let passport = require('passport');
let multer=require('multer');

let Picture_storage=multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,'./uploads/user/'+file.fieldname);
    },
    filename: function (req, file, cb) {
        cb(null,Date.now()+"!"+file.originalname);
    }
});

let uploadPicture=multer({storage:Picture_storage});

/* GET users listing. */

router.get('/submit', loginCheck.login_check_reverse, controller.user_submit);
router.get('/login', loginCheck.login_check_reverse, controller.user_login);
router.get('/confirm_certificate/:id',controller.user_confirm_certificate);
router.get('/auth/google', loginCheck.login_check_reverse, controller.google_login);
router.get('/auth/google/callback',controller.google_login_callback);
router.get('/auth/kakao', loginCheck.login_check_reverse, controller.kakao_login);
router.get('/auth/kakao/callback',controller.kakao_login_callback);
router.get('/auth/naver', loginCheck.login_check_reverse, controller.naver_login);
router.get('/auth/naver/callback',controller.naver_login_callback);
router.get('/auth/social',loginCheck.login_check,controller.social_add_name);
router.get('/logout', loginCheck.login_check, controller.user_logout);
router.get('/re_mailing',loginCheck.login_check,controller.user_re_mailing);
router.get('/author_register',loginCheck.login_check,loginCheck.isCertificate_check,loginCheck.seller_check_reverse
    ,controller.author_register);
router.get('/author_register2',loginCheck.login_check,loginCheck.isCertificate_check,loginCheck.seller_check_reverse
    ,loginCheck.isPhoneCert_check,controller.author_register_2);
router.get('/author_register3',loginCheck.login_check,loginCheck.isCertificate_check,loginCheck.seller_check_reverse
    ,loginCheck.isPhoneCert_check,loginCheck.imageStudentIden_check,controller.author_register_3);
router.get('/submit/end', loginCheck.login_check_reverse,controller.user_submit_end);
/*POST*/

router.post('/submit/author_register2',controller.author_register_2_post);
router.post('/submit/upload_stuiden',uploadPicture.single('student_Iden'),controller.user_submit_author_upload_student_Iden_post);
router.post('/submit/phoneVerification',controller.user_submit_smsVerification_post);
router.post('/submit/smsVerification',controller.user_submit_smsVerification_post_ncpV2);
router.post('/submit/author_register',controller.user_submit_author_register_post);
router.post('/submit',controller.user_submit_post);
router.post('/login',controller.user_login_post);
router.post('/re_mailing',controller.user_re_mailing_post);
router.post('/logout',controller.user_logout_post);
router.post('/auth/social',controller.social_add_name_post);
module.exports = router;
