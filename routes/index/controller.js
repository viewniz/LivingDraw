let express = require('express');
let bodyParser = require('body-parser');
let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

exports.index_main= function(req, res, next) {
    res.render('index/index');
};

