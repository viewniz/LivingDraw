let express = require('express');
let bodyParser = require('body-parser');
var fs = require('fs');

let app = express();

let Border = require('../../models/border');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

exports.border_main= function(req, res, next) {
    // var total = Border.find({});

    Border.find.skip(function (err, border) {
        //req로 pre_pagenum 받기
        var pre_page = 1; //현재 페이지 수

        var totalcount = border.length;
        console.log(totalcount);
        var countlist = 25; //한 페이지에 출력될 게시물 수
        var totalpage = parseInt(totalcount / countlist); //총 페이지 수

        console.log(totalpage);
        if (totalcount % countlist > 0) {
            totalpage++;
        }

        var countpage =3; //한 화면에 출력될 페이지 수
        var startpage = parseInt((parseInt(pre_page - 1) / countpage) * countpage + 1); //start page 구하기
        var endpage = parseInt(startpage + countpage - 1);

        //  페이지보정
        if (endpage > totalpage) {
            endpage = totalpage;
        }
        console.log(startpage);
        console.log(endpage);
        res.render('border/border_detail',{border:border,startpage:startpage,endpage:endpage});
    });
};

exports.product_detail= function(req, res, next) {
    let borderNum=req.params.id;
    Border.findOne({_id:borderNum},function (err, border) {
        res.render('border/product',{border:border});
    });
};