const express = require('express');
const router = express.Router();
const controller=require('./controller');
const loginCheck=require('../../config/loginCheck');

/* GET users listing. */

router.get('/test', controller.payment_request);
router.get('/test/rest', controller.get_token_test);
router.get('/test/payments', controller.payments_test_get);
router.get('/test/cancel', controller.payments_cancel_test_post);

/*POST*/
//router.post('/submit', loginCheck.login_check_reverse, controller.user_submit);
router.post('/complete', controller.payments_complete_post);
module.exports = router;
