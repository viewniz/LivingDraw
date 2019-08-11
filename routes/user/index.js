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

router.get('/submit', controller.user_submit);
router.get('/login',controller.user_login);
router.get('/confirm_certificate/:id',controller.user_confirm_certificate);

/*POST*/

router.post('/submit',controller.user_submit_post);
router.post('/login',controller.user_login_post);
router.post('/logout',controller.user_logout_post);
module.exports = router;
