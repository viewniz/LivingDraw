const express = require('express');
const router = express.Router();
const controller=require('./controller');
const loginCheck=require('../../config/loginCheck');
const pictureStorage = require('../../config/pictureStorage');

//get
router.get('/', loginCheck, loginCheck.sellerCheck, controller);
router.get('/upload', loginCheck, loginCheck.sellerCheck, controller.upload1);
router.get('/upload2', loginCheck, loginCheck.sellerCheck, controller.upload2);
router.get('/upload3', loginCheck, loginCheck.sellerCheck, controller.upload3);
router.get('/update/:id', loginCheck, loginCheck.sellerCheck, controller.update1);
router.get('/update2/:id', loginCheck, loginCheck.sellerCheck, controller.update2);
router.get('/update3/:id', loginCheck, loginCheck.sellerCheck, controller.update3);

//post
router.post('/upload', loginCheck, loginCheck.sellerCheck, pictureStorage('picRaw', './uploads/'), controller.p_upload1PicTemp);
router.post('/upload1', loginCheck, loginCheck.sellerCheck, controller.p_upload1);
router.post('/upload2', loginCheck, loginCheck.sellerCheck, controller.p_upload2);
router.post('/upload3', loginCheck, loginCheck.sellerCheck, controller.p_upload3);

//put
router.put('/update1/:id', loginCheck, loginCheck.sellerCheck, controller.put_update1);
router.put('/update2/:id', loginCheck, loginCheck.sellerCheck, controller.put_update2);
router.put('/update3/:id', loginCheck, loginCheck.sellerCheck, controller.put_update3);
router.put('/update/:id', loginCheck, loginCheck.sellerCheck, pictureStorage('picRaw','./uploads/'), controller.put_update1Pic);

//delete
router.delete('/', loginCheck, loginCheck.sellerCheck, controller.d_piece);
module.exports = router;
