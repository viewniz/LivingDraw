const request=require('request-promise-native');
const SecretKey = require('../../config/SecretKey');

module.exports = async function (){
    const method = 'POST';
    const uri = 'https://api.iamport.kr/users/getToken'
    const IMP_API_access_key = SecretKey.IMP_API_access_key;
    const IMP_API_secret_key = SecretKey.IMP_API_secret_key;
    const result = await request({
        method: method,
        json: true,
        uri: uri,
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
    });
    return result;
};