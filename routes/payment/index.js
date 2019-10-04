const express = require('express');
const router = express.Router();
const controller=require('./controller');
const loginCheck=require('../../config/loginCheck');

/* GET users listing. */

router.get('/request', controller.payment_request);
/*POST*/
//router.post('/submit', loginCheck.login_check_reverse, controller.user_submit);

module.exports = router;
