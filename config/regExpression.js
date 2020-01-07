const regType = /^[ㄱ-ㅎㅏ-ㅣ가-힣A-Za-z0-9!@#$%^&*().,?;:'"~ +]{0,1000}$/;
const regTypeOneToFifty = /^[ㄱ-ㅎㅏ-ㅣ가-힣A-Za-z0-9!@#$%^&*().,?;:'"~ +]{1,50}$/;
const regTypeNumber = /^[0-9+]{1,1000}$/;
const regTypeKorean = /^[ㄱ-ㅎㅏ-ㅣ가-힣0-9:,?!()+]{1,50}$/;
const regTypeEnglish = /^[A-Za-z0-9:,+?!()]{1,50}$/;
const regTypeMe = /^[A-Za-z+]{2}$/;

module.exports = str => regType.test(str);
module.exports.typeOneToFifty = str => regTypeOneToFifty.test(str);
module.exports.typeNumber = str => regTypeNumber.test(str);
module.exports.typeKorean = str => regTypeKorean.test(str);
module.exports.typeEnglish = str => regTypeEnglish.test(str);
module.exports.typeMe = str => regTypeMe.test(str);