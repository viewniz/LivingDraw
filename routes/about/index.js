const express = require('express');
const router = express.Router();
const controller=require('./controller');

/* GET users listing. */

router.get('/', controller);

module.exports = router;