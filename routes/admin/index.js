let express = require('express');
let router = express.Router();
let controller=require('./controller');
let multer=require('multer');
let Picture_storage=multer.diskStorage({
    destination: function (req, file, cb) {
        const fieldName = file.fieldname.replace(/[\[\]]+/g, '');
        cb(null,'./uploads/'+fieldName);
    },
    filename: function (req, file, cb) {
        cb(null,Date.now()+"!"+file.originalname);
    }
});
let uploadPicture=multer({storage:Picture_storage});
let Picture_storage_raw=multer.diskStorage({
    destination: function (req, file, cb) {
        const fieldName = file.fieldname.replace(/[\[\]]+/g, '');
        cb(null,'./uploads/'+fieldName+'Raw');
    },
    filename: function (req, file, cb) {
        cb(null,Date.now()+"!"+file.originalname);
    }
});
let uploadPictureRaw=multer({storage:Picture_storage_raw});

const siteRouter = require('./site/index');
const exhibitionRouter = require('./exhibition/index');


/* GET users listing. */
router.use('/site',siteRouter);
router.use('/exhibition',exhibitionRouter);

router.get('/', controller.admin_login_check_yes, controller.admin_main);
router.get('/member/submit', controller.admin_login_check_yes, controller.admin_submit);
router.get('/member', controller.admin_login_check_yes, controller.admin_member);
router.get('/login', controller.admin_login);
router.get('/border', controller.admin_login_check_yes, controller.admin_border);
router.get('/user', controller.admin_login_check_yes, controller.admin_user);
router.get('/user/permissionSeller', controller.admin_login_check_yes, controller.admin_user_permissionSeller);
router.get('/border/upload', controller.admin_login_check_yes, controller.admin_border_upload);
router.get('/border/update/:id', controller.admin_login_check_yes, controller.admin_border_update);
router.get('/member/logout', controller.admin_login_check_yes, controller.admin_logout);

//post
router.post('/border/upload', controller.admin_login_check_yes, uploadPictureRaw.array('pic'), controller.admin_border_upload_post);
router.post('/border/delete', controller.admin_login_check_yes, controller.admin_border_delete_post);
router.post('/border/isSellingChange', controller.admin_login_check_yes, controller.admin_border_is_selling_change);
router.post('/border/update/removeImage', controller.admin_login_check_yes, controller.admin_border_update_remove_image);
router.post('/border/update', controller.admin_login_check_yes, uploadPictureRaw.array('pic'), controller.admin_border_update_post);
router.post('/member/submit', controller.admin_login_check_yes, uploadPicture.single('adminFace'), controller.admin_submit_post);
router.post('/member/delete', controller.admin_login_check_yes, controller.admin_delete_post);
router.post('/user/permissionSeller', controller.admin_login_check_yes, controller.admin_user_permissionSeller_post);

router.post('/login', controller.admin_login_post);

module.exports = router;
