var express = require('express');
var router = express.Router();
var controller=require('./controller');






/* GET users listing. */

router.get('/', controller.border_main);
router.get('/product/:id', controller.product_detail);
module.exports = router;
