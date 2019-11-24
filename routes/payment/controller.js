const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
require('moment-timezone');
const request=require('request-promise-native');
const imp_authenticate=require('./imp_authenticate');

moment.tz.setDefault("Asia/Seoul");

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const Payments = require('../../models/payments_result');

exports.payment_request = function (req, res, next) {
    res.render('./payments/test');
};

exports.payments_complete_post = function (req, res, next) {
    const pg = req.body.pg;                             //pg사 정보
    const pay_method = req.body.pay_method;             //결제방법
    const merchant_uid = req.body.merchant_uid;         //구매번호('merchant_' + new Date().getTime())
    const name = req.body.name;                         //구매자 이름
    const amount = req.body.amount;                     //결제예상금액
    const buyer_email = req.body.buyer_email;           //구매자 메일
    const buyer_name = req.body.buyer_name;             //구매자 이름
    const buyer_tel = req.body.buyer_tel;               //구매자 번호
    const buyer_addr = req.body.buyer_addr;             //구매자 주소
    const buyer_postcode = req.body.buyer_postcode;     //우편번호
    const imp_uid=req.body.imp_uid;                     //아임포트 결제번호
    const paid_amount = req.body.paid_amount;           //실제 결제금액
    const apply_num = req.body.apply_num;               //카드승인번호
    const status = req.body.status;                     //결제상태
    const receipt_url = req.body.receipt_url;           //매출전표 url
    const newPayments = new Payments();
    newPayments.pg = pg;
    newPayments.pay_method = pay_method;
    newPayments.merchant_uid = merchant_uid;
    newPayments.name = name;
    newPayments.amount = amount;
    newPayments.buyer_email = buyer_email;
    newPayments.buyer_name = buyer_name;
    newPayments.buyer_tel = buyer_tel;
    newPayments.buyer_addr = buyer_addr;
    newPayments.buyer_postcode = buyer_postcode;
    newPayments.imp_uid = imp_uid;
    newPayments.paid_amount = paid_amount;
    newPayments.apply_num = apply_num;
    newPayments.status = status;
    newPayments.receipt_url = receipt_url;
    newPayments.save(function(err){
        if(err){
            res.send(err);
            return;
        }
        if(amount!==paid_amount)
        {
            res.send("실제 결제금액과 총 결제금액이 다릅니다.");
            return;
        }
        res.send("clear");
    });
};


exports.get_token_test = async function (req, res, next) {
    let a = await imp_authenticate();
    console.log(a);
    res.send(a.response.access_token);
};

exports.payments_test_get = async function (req, res, next) {
    let a = await imp_authenticate();

    let b= await Payments.findOne({imp_uid:'imp_080438021395'});
    const imp_uid = b.imp_uid;
    const access_token=a.response.access_token;
    const method='GET';
    const uri='https://api.iamport.kr/payments/'+imp_uid;
    const result = await request({
        method: method,
        json: true,
        uri: uri,
        headers: {
            Authorization: access_token,
            'X-ImpTokenHeader': access_token
        }
    });
    res.send(result);
};

exports.payments_cancel_test_post = async function (req, res, next) {
    let a = await imp_authenticate();

    let b= await Payments.findOne({imp_uid:'imp_080438021395'});
    const imp_uid = b.imp_uid;
    const merchant_uid = b.merchant_uid;
    const reason = "test";
    const access_token=a.response.access_token;
    const method='POST';
    const uri='https://api.iamport.kr/payments/cancel';
    const result = await request({
        method: method,
        json: true,
        uri: uri,
        headers: {
            Authorization: access_token,
            'X-ImpTokenHeader': access_token
        },
        body: {
            imp_uid: imp_uid,
            merchant_uid: merchant_uid,
            reason : reason
        }
    });
    res.send(result);
};
