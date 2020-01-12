const express = require('express');
const router = express.Router();
const controller=require('./controller');

/* GET users listing. */

router.get('/', controller.borderOutOfBounds);
router.get('/:id',controller.borderMain);
router.get('/product/:id', controller.productDetail);

module.exports = router;