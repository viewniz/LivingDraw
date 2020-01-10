const express = require('express');
const router = express.Router();
const controller=require('./controller');

const siteRouter = require('./site/index');
const exhibitionRouter = require('./exhibition/index');
const borderRouter = require('./border/index');
const userRouter = require('./user/index');
const memberRouter = require('./member/index');

router.use('/site',siteRouter);
router.use('/exhibition',exhibitionRouter);
router.use('/border',borderRouter);
router.use('/user',userRouter);
router.use('/member',memberRouter);

//get
router.get('/', controller.admin_login_check_yes, controller.admin_main);
router.get('/login', controller.admin_login);

//post
router.post('/login', controller.admin_login_post);

module.exports = router;
