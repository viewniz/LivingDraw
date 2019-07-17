let express = require('express');
let bodyParser = require('body-parser');
var fs = require('fs');

let app = express();

let Border = require('../../models/border');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

exports.border_main= function(req, res, next) {
    // var total = Border.find({});

    Border.find(function (err, border) {
        var totalcount = border.length;
        console.log(totalcount);
        var countlist = 3;
        var totalpage = parseInt(totalcount / countlist);

        console.log(totalpage);
        if (totalcount % countlist > 0) {
            totalpage++;
        }
        // console.log(totalpage);
        // if (totalpage < page) {
        //     page = totalPage; //현재페이지 == total페이지 만들기
        // }

        var pre_page = 1;
        var countpage =3;

        var startpage = parseInt(((pre_page - 1) / 10) * 10 + 1);
        var endpage = parseInt(startpage + countpage - 1);

        //  여기서 마지막 페이지를 보정해줍니다.

        if (endpage > totalpage) {
            endpage = totalpage;
        }

        res.render('border/border_detail',{border:border});
    });
};

exports.product_detail= function(req, res, next) {
    let borderNum=req.params.id;
    Border.findOne({_id:borderNum},function (err, border) {
        res.render('border/product',{border:border});
    });
};