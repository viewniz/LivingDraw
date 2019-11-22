const request=require('request-promise-native');
const SecretKey = require('../../config/SecretKey');

module.exports = async function (){
    const method = 'POST';
    const uri = 'https://api.iamport.kr/users/getToken'
    const IMP_API_access_key = SecretKey.IMP_API_access_key;
    const IMP_API_secret_key = SecretKey.IMP_API_secret_key;
    return await request({
        method: method,
        json: true,
        uri: uri,
        body: {
            imp_key: IMP_API_access_key,
            imp_secret: IMP_API_secret_key
        }
    });
};