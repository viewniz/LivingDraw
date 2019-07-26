let express = require('express');
let bodyParser = require('body-parser');
var fs = require('fs');

let app = express();

let Border = require('../../models/border');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

exports.border_main = function (req, res, next) {
    res.redirect('/border/1');
};

exports.border_main_second = function (req, res, next) {
    let countlist_out = 10; //한 페이지에 출력될 게시물 수
    let pa=req.params.id.split("?");
    let pre_page = parseInt(pa[0]);
    if (pre_page < 1) {
        res.redirect('/border/1');
    }
    Border.count(function (err, remove) {
        let removetotal = remove; //db총개수
        // console.log(removetotal);
        let removecountlist = countlist_out;  //한 페이지에 출력될 게시물 수
        let totalremovelist = parseInt(removetotal / removecountlist); // 총 페이지 수
        if (removetotal % removecountlist > 0) {
            // console.log('please');
            ++totalremovelist;
        }
        if (pre_page > totalremovelist) {
            res.redirect('/border/' + totalremovelist);
        }
        else {
            // console.log("pre" + pre_page);
            let skip_num = (pre_page - 1) * countlist_out;
            switch (req.query.sort) {
                case 'old':
                    Border.find({}).skip(skip_num).limit(countlist_out).sort( { "submit_date": 1 } ).exec(function (err, border) {
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
                            // console.log(totalpage);
                            // pre_page = parseInt(pre_page);
                            // console.log(pre_page);
                            res.render('border/border_detail', {
                                border: border,
                                startpage: startpage,
                                endpage: endpage,
                                totalcount: totalcount,
                                pre_page: pre_page,
                                totalpage: totalpage,
                                sort: '?sort='+req.query.sort
                            });
                        });
                    });
                    break;
                case 'new':
                    Border.find({}).skip(skip_num).limit(countlist_out).sort( { "submit_date": -1 } ).exec(function (err, border) {
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
                            // console.log(totalpage);
                            // pre_page = parseInt(pre_page);
                            // console.log(pre_page);
                            res.render('border/border_detail', {
                                border: border,
                                startpage: startpage,
                                endpage: endpage,
                                totalcount: totalcount,
                                pre_page: pre_page,
                                totalpage: totalpage,
                                sort: '?sort='+req.query.sort
                            });
                        });
                    });
                    break;
                case 'high':
                    Border.find({}).skip(skip_num).limit(countlist_out).sort( { "price": -1 } ).exec(function (err, border) {
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
                            // console.log(totalpage);
                            // pre_page = parseInt(pre_page);
                            // console.log(pre_page);
                            res.render('border/border_detail', {
                                border: border,
                                startpage: startpage,
                                endpage: endpage,
                                totalcount: totalcount,
                                pre_page: pre_page,
                                totalpage: totalpage,
                                sort: '?sort='+req.query.sort
                            });
                        });
                    });
                    break;
                case 'low':
                    Border.find({}).skip(skip_num).limit(countlist_out).sort( { "price": 1 } ).exec(function (err, border) {
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
                            // console.log(totalpage);
                            // pre_page = parseInt(pre_page);
                            // console.log(pre_page);
                            res.render('border/border_detail', {
                                border: border,
                                startpage: startpage,
                                endpage: endpage,
                                totalcount: totalcount,
                                pre_page: pre_page,
                                totalpage: totalpage,
                                sort: '?sort='+req.query.sort
                            });
                        });
                    });
                    break;
                default:
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
                            // console.log(totalpage);
                            // pre_page = parseInt(pre_page);
                            // console.log(pre_page);
                            res.render('border/border_detail', {
                                border: border,
                                startpage: startpage,
                                endpage: endpage,
                                totalcount: totalcount,
                                pre_page: pre_page,
                                totalpage: totalpage
                            });
                        });
                    });
                    break;
            }
        }
    });
};

exports.product_detail = function (req, res, next) {
    let borderNum = req.params.id;
    console.log(borderNum);
    Border.findOne({_id: borderNum}, function (err, border) {
        Border.updateOne({_id:borderNum}, { $inc: { view: 1} }, function (err, result) {});
        res.render('border/product', {border: border});
    });
};
