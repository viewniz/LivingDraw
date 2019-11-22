var express = require('express');
var router = express.Router();
var controller=require('./controller');










/* GET users listing. */

router.get('/', controller.exhibition_main);
router.get('/detail', controller.exhibition_detail); //db연동해야합니당.


module.exports = router;
