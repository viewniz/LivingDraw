const express = require('express');
const router = express.Router();
const controller=require('./controller');
const loginCheck=require('../config/loginCheck');
const pictureStorage=require('../../../config/pictureStorage');

//get
router.get('/', loginCheck, controller.member);
router.get('/submit', loginCheck, controller.memberSubmit);
router.get('/logout', loginCheck, controller.memberLogout);

//post
router.post('/submit', loginCheck, pictureStorage('adminFace','./uploads/'), controller.p_memberSubmit);

//delete
router.delete('/delete', loginCheck, controller.d_memberDelete);

module.exports = router;
