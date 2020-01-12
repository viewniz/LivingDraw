const express = require('express');
const router = express.Router();
const controller=require('./controller');

const loginCheck=require('../../config/loginCheck');
const pictureStorage = require('../../config/pictureStorage');

/* GET users listing. */
router.get('/submit', loginCheck.loginCheckReverse, controller.submit);
router.get('/login', loginCheck.loginCheckReverse, controller.login);
router.get('/confirm_certificate/:id',controller.confirmCertificate);
router.get('/auth/google', loginCheck.loginCheckReverse, controller.googleLogin);
router.get('/auth/google/callback',controller.googleLoginCallback);
router.get('/auth/kakao', loginCheck.loginCheckReverse, controller.kakaoLogin);
router.get('/auth/kakao/callback',controller.kakaoLoginCallback);
router.get('/auth/naver', loginCheck.loginCheckReverse, controller.naverLogin);
router.get('/auth/naver/callback',controller.naverLoginCallback);
router.get('/auth/social',loginCheck,controller.socialAddName);
router.get('/logout', loginCheck, controller.logout);
router.get('/re_mailing',loginCheck,controller.reMailing);
router.get('/author_register',loginCheck,loginCheck.isCertificateCheck,loginCheck.sellerCheckReverse,
    controller.authorRegister);
router.get('/author_register2',loginCheck,loginCheck.isCertificateCheck,loginCheck.sellerCheckReverse,
    loginCheck.isPhoneCertCheck,controller.authorRegister2);
router.get('/author_register3',loginCheck,loginCheck.isCertificateCheck,loginCheck.sellerCheckReverse,
    loginCheck.isPhoneCertCheck,loginCheck.imageStudentIdenCheck,controller.authorRegister3);
router.get('/submit/end', loginCheck.loginCheckReverse,controller.submitEnd);

/*POST*/
router.post('/submit/author_register2', controller.p_authorRegister2);
router.post('/submit/upload_stuiden', pictureStorage('student_Iden','./uploads/user/'), controller.p_submitAuthorUploadStudentIden);
router.post('/submit/phoneVerification', controller.p_submitSmsVerification);
router.post('/submit/smsVerification', controller.p_submitSmsVerificationNcpV2);
router.post('/submit/author_register', controller.p_submitAuthorRegister);
router.post('/submit', controller.p_submit);
router.post('/login', controller.p_login);
router.post('/re_mailing', controller.p_reMailing);
router.post('/logout', controller.p_logout);
router.post('/auth/social', controller.p_socialAddName);

module.exports = router;