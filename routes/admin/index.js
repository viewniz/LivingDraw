const express = require('express');
const router = express.Router();
const controller=require('./controller');
const loginCheck=require('./config/loginCheck');

const siteRouter = require('./site/index');
const exhibitionRouter = require('./exhibition/index');
const borderRouter = require('./border/index');
const userRouter = require('./user/index');
const memberRouter = require('./member/index');

router.use('/site', siteRouter);
router.use('/exhibition', exhibitionRouter);
router.use('/border', borderRouter);
router.use('/user', userRouter);
router.use('/member', memberRouter);

//get
router.get('/', loginCheck, controller);
router.get('/login', controller.login);

//post
router.post('/login', controller.p_login);

module.exports = router;
