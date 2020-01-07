const express = require('express');
const router = express.Router();
const controller=require('./controller');
const loginCheck=require('../config/loginCheck');
const pictureStorage=require('../../../config/pictureStorage');

router.get('/openGraphImage', loginCheck, controller.ogImage);
router.get('/banner', loginCheck, controller.banner);
router.get('/box', loginCheck, controller.box);
router.get('/logo', loginCheck, controller.logo);
router.get('/option/submit', loginCheck, controller.optionSubmit);
router.get('/option', loginCheck, controller.option);

router.post('/banner', loginCheck, pictureStorage.withExtSingle('banner','bannerImage.','./uploads/'), controller.p_banner);
router.post('/box', loginCheck, pictureStorage.withExtSingle('box','boxImage.','./uploads/'), controller.p_box);
router.post('/logo', loginCheck, pictureStorage.withExtSingle('logo','logoImage.','./uploads/'), controller.p_logo);
router.post('/openGraphImage', loginCheck, pictureStorage.withExtSingle('ogImage','ogImage.','./uploads/'), controller.p_ogImage);
router.post('/option/submit', loginCheck, controller.p_optionSubmit);
router.post('/option', loginCheck, controller.p_option);

module.exports = router;
