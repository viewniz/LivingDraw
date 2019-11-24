const express = require('express');
const router = express.Router();
const controller=require('./controller');

/* GET users listing. */

router.get('/', controller.exhibition_main);
router.get('/:id', controller.exhibition_detail);


module.exports = router;
