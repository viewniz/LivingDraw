var express = require('express');
var router = express.Router();
var controller=require('./controller');
/* GET users listing. */

router.get('/', controller.carts_main);
module.exports = router;
