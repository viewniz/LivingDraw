const request=require('request');
const SecretKey = require('../../config/SecretKey');

module.exports = function (req,res,next) {
    const method = 'POST';
    const url = 'https://api.iamport.kr/users/getToken';
    const IMP_API_access_key = SecretKey.IMP_API_access_key;
    const IMP_API_secret_key = SecretKey.IMP_API_secret_key;
    return request({
        method: method,
        json: true,
        uri: url,
        headers: {
            /*'Content-Type': 'application/json; charset=utf-8',
            'x-ncp-iam-access-key' : NCP_accessKey,
            'x-ncp-apigw-timestamp': timestamp,
            'x-ncp-apigw-signature-v2': signature.toString()*/
        },
        body: {
            imp_key:IMP_API_access_key,
            imp_secret:IMP_API_secret_key
        }
    },function (err, res, html) {
        if(err) console.log(err);
        console.log(res.body);
        return res.body.response.access_token;
    });
};