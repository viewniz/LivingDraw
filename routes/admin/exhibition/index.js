const express = require('express');
const router = express.Router();
const controller=require('./controller');
const loginCheck=require('../config/loginCheck');
const pictureStorage=require('../../../config/pictureStorage');

router.get('/', loginCheck, controller.exhibition);
router.get('/upload', loginCheck, controller.exhibitionUpload);

router.post('/upload', loginCheck, pictureStorage.fields([{name:'picPosterRaw[]'}, {name:'picExhibitionRaw[]'}], './uploads/'), controller.p_exhibitionUpload);
router.delete('/', loginCheck, controller.d_exhibition);

module.exports = router;
