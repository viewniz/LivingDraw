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

router.get('/', controller.border_main);
router.get('/:id',controller.border_main_second);
router.get('/product/:id', controller.product_detail);
module.exports = router;
