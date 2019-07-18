let express = require('express');
let bodyParser = require('body-parser');
var fs = require('fs');

let app = express();

let Border = require('../../models/border');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

exports.border_main = function (req, res, next) {
    let countlist_out = 3; //한 페이지에 출력될 게시물 수
    let pre_page = 1;
    let skip_num = 0;

    Border.find({}).skip(skip_num).limit(countlist_out).exec(function (err, border) {
        Border.count(function (err, totalcount_please) {
            var totalcount = totalcount_please;

            console.log(totalcount);

            var countlist = countlist_out; //한 페이지에 출력될 게시물 수

            var totalpage = parseInt(totalcount / countlist); //총 페이지 수

            console.log(totalpage);

            if (totalcount % countlist > 0) {
                totalpage++;
            }

            var countpage = 3; //한 화면에 출력될 페이지 수
            var startpage = parseInt((parseInt(pre_page - 1) / countpage) * countpage + 1); //start page 구하기
            var endpage = parseInt(startpage + countpage - 1);

            //  페이지보정
            if (endpage > totalpage) {
                endpage = totalpage;
            }

            console.log(startpage);

            console.log(endpage);

            console.log(border.length);

            res.render('border/border_detail', {
                border: border,
                startpage: startpage,
                endpage: endpage,
                totalcount: totalcount,
                pre_page: pre_page
            });
        });
    });
};

exports.border_main_second = function (req, res, next) {
    let countlist_out = 3; //한 페이지에 출력될 게시물 수
    let pre_page = parseInt(req.params.id);
    let skip_num = (pre_page - 1) * countlist_out;

    Border.find({}).skip(skip_num).limit(countlist_out).exec(function (err, border) {
        Border.count(function (err, totalcount_please) {

            var totalcount = totalcount_please; //db총 개수
            var countlist = countlist_out; //한 페이지에 출력될 게시물 수
            var totalpage = parseInt(totalcount / countlist); //총 페이지 수
            if (totalcount % countlist > 0) {
                totalpage++;
            }

            var countpage = 3; //한 화면에 출력될 페이지 수
            var startpage = parseInt((pre_page - 1) / countpage) * countpage + 1; //start page 구하기

            var endpage = parseInt(startpage + countpage - 1);

            //  페이지보정
            if (endpage > totalpage) {
                endpage = totalpage;
            }
            res.render('border/border_detail', {
                border: border,
                startpage: startpage,
                endpage: endpage,
                totalcount: totalcount,
                pre_page: pre_page
            });
        });
    });
};

exports.product_detail = function (req, res, next) {
    let borderNum = req.params.id;
    Border.findOne({_id: borderNum}, function (err, border) {
        res.render('border/product', {border: border});
    });
};