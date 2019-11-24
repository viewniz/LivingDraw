let express = require('express');
let router = express.Router();
let controller=require('./controller');

/* GET users listing. */

router.get('/', controller.border_main);
router.get('/:id',controller.border_main_second);
router.get('/product/:id', controller.product_detail);

module.exports = router;
