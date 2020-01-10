const express = require('express');
const router = express.Router();
const controller=require('./controller');
const loginCheck=require('../config/loginCheck');

//get
router.get('/', loginCheck, controller.user);
router.get('/permissionSeller', loginCheck, controller.userPermissionSeller);

//put
router.put('/permissionSeller', loginCheck, controller.p_userPermissionSeller);

module.exports = router;
