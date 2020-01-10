const express = require('express');
const router = express.Router();
const controller=require('./controller');
const loginCheck=require('../config/loginCheck');
const pictureStorage=require('../../../config/pictureStorage');

//get
router.get('/', loginCheck, controller.border);
router.get('/upload', loginCheck, controller.borderUpload);
router.get('/:id', loginCheck, controller.borderUpdate);

//post
router.post('/upload', loginCheck, pictureStorage.array('picRaw','./uploads/'), controller.p_borderUpload);
router.post('/', loginCheck, pictureStorage.array('picRaw','./uploads/'), controller.p_borderUpdate);

//put
router.put('/isSellingChange', loginCheck, controller.p_borderIsSellingChange);

//delete
router.delete('/removeImage', loginCheck, controller.d_borderUpdateRemoveImage);
router.delete('/', loginCheck, controller.d_borderDelete);

module.exports = router;