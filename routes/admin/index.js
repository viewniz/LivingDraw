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
let Banner_storage=multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,'./uploads/'+file.fieldname);
    },
    filename: function (req, file, cb) {
        let ext=file.mimetype.split('/')[1];
        cb(null,'bannerImage.'+ext);
    }
});
let uploadBanner=multer({storage:Banner_storage});
let Box_storage=multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,'./uploads/'+file.fieldname);
    },
    filename: function (req, file, cb) {
        let ext=file.mimetype.split('/')[1];
        cb(null,'boxImage.'+ext);
    }
});
let uploadBox=multer({storage:Box_storage});
let Logo_storage=multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,'./uploads/'+file.fieldname);
    },
    filename: function (req, file, cb) {
        let ext=file.mimetype.split('/')[1];
        cb(null,'logoImage.'+ext);
    }
});
let uploadLogo=multer({storage:Logo_storage});
let ogImage_storage=multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,'./uploads/'+file.fieldname);
    },
    filename: function (req, file, cb) {
        let ext=file.mimetype.split('/')[1];
        cb(null,'ogImage.'+ext);
    }
});
let uploadOgImage=multer({storage:ogImage_storage});
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

/* GET users listing. */

router.get('/', controller.admin_login_check_yes, controller.admin_main);
router.get('/member/submit', controller.admin_login_check_yes, controller.admin_submit);
router.get('/member', controller.admin_login_check_yes, controller.admin_member);
router.get('/login', controller.admin_login);
router.get('/border', controller.admin_login_check_yes, controller.admin_border);
router.get('/user', controller.admin_login_check_yes, controller.admin_user);
router.get('/user/permissionSeller', controller.admin_login_check_yes, controller.admin_user_permissionSeller);
router.get('/site/openGraphImage', controller.admin_login_check_yes, controller.admin_site_ogImage);
router.get('/site/banner', controller.admin_login_check_yes, controller.admin_site_banner);
router.get('/site/box', controller.admin_login_check_yes, controller.admin_site_box);
router.get('/site/logo', controller.admin_login_check_yes, controller.admin_site_logo);
router.get('/site/option/submit', controller.admin_login_check_yes, controller.admin_site_option_submit);
router.get('/site/option', controller.admin_login_check_yes, controller.admin_site_option);
router.get('/border/upload', controller.admin_login_check_yes, controller.admin_border_upload);
router.get('/border/update/:id', controller.admin_login_check_yes, controller.admin_border_update);
router.get('/member/logout', controller.admin_login_check_yes, controller.admin_logout);
router.get('/exhibition', controller.admin_login_check_yes, controller.admin_exhibition);
router.get('/exhibition/upload', controller.admin_login_check_yes, controller.admin_exhibition_upload);
//post
router.post('/border/upload', controller.admin_login_check_yes, uploadPictureRaw.array('pic'), controller.admin_border_upload_post);
router.post('/border/delete', controller.admin_login_check_yes, controller.admin_border_delete_post);
router.post('/border/isSellingChange', controller.admin_login_check_yes, controller.admin_border_is_selling_change);
router.post('/border/update/removeImage', controller.admin_login_check_yes, controller.admin_border_update_remove_image);
router.post('/border/update', controller.admin_login_check_yes, uploadPictureRaw.array('pic'), controller.admin_border_update_post);
router.post('/member/submit', controller.admin_login_check_yes, uploadPicture.single('adminFace'), controller.admin_submit_post);
router.post('/member/delete', controller.admin_login_check_yes, controller.admin_delete_post);
router.post('/site/banner', controller.admin_login_check_yes,uploadBanner.single('banner'), controller.admin_site_banner_post);
router.post('/site/box', controller.admin_login_check_yes,uploadBox.single('box'), controller.admin_site_box_post);
router.post('/site/logo', controller.admin_login_check_yes,uploadLogo.single('logo'), controller.admin_site_logo_post);
router.post('/site/openGraphImage', controller.admin_login_check_yes,uploadOgImage.single('ogImage'), controller.admin_site_ogImage_post);
router.post('/site/option/submit', controller.admin_login_check_yes, controller.admin_site_option_submit_post);
router.post('/site/option', controller.admin_login_check_yes, controller.admin_site_option_post);
router.post('/user/permissionSeller', controller.admin_login_check_yes, controller.admin_user_permissionSeller_post);
router.post('/exhibition/upload', controller.admin_login_check_yes, uploadPictureRaw.fields([{name:'picPoster[]'}, {name:'picExhibition[]'}]), controller.admin_exhibition_upload_post);
router.post('/exhibition/delete', controller.admin_login_check_yes, controller.admin_exhibition_delete_post);

router.post('/login', controller.admin_login_post);

module.exports = router;
