let express = require('express');
let router = express.Router();
let controller=require('./controller');
let multer=require('multer');

let Picture_storage=multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,'./uploads/'+file.fieldname);
    },
    filename: function (req, file, cb) {
        cb(null,Date.now()+"!"+file.originalname);
    }
});
let uploadPicture=multer({storage:Picture_storage});


/* GET users listing. */

router.get('/', controller.admin_main);
router.get('/submit', controller.admin_submit);
router.get('/login', controller.admin_login);
router.get('/border', controller.admin_border);
router.get('/border/upload', controller.admin_border_upload);
router.get('/border/update/:id', controller.admin_border_update);

//post
router.post('/border/upload', uploadPicture.array('pic'), controller.admin_border_upload_post);
router.post('/border/delete', controller.admin_border_delete_post);
router.post('/border/isSellingChange', controller.admin_border_is_selling_change);
router.post('/border/update/removeImage', controller.admin_border_update_remove_image);
router.post('/border/update', uploadPicture.array('pic'), controller.admin_border_update_post);
router.post('/submit', uploadPicture.single('adminFace'), controller.admin_submit_post);
module.exports = router;
