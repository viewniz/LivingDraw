const regType = /^[ㄱ-ㅎㅏ-ㅣ가-힣A-Za-z0-9!@#$%^&*().,?;:'"~ +]{0,1000}$/;
const regTypeNumber = /^[0-9+]{0,1000}$/;
const regTypeKorean = /^[ㄱ-ㅎㅏ-ㅣ가-힣0-9!@#$%^&*().,?;:'"~ +]{0,1000}$/;
const regTypeKoreanOnly =  /^[ㄱ-ㅎㅏ-ㅣ가-힣+]{0,1000}$/;
const regTypeEnglish = /^[A-Za-z \-0-9!@#$%^&*().,?;:'"~ +]{0,1000}$/;
const regTypeEnglishOnly = /^[A-Za-z \-+]{0,1000}$/;

const checkReg = (str, type) => {
    let reg;
    switch(type){
        case "number":
            reg = regTypeNumber;
            break;
        case "korean":
            reg = regTypeKorean;
            break;
        case "koreanOnly":
            reg = regTypeKoreanOnly;
            break;
        case "english":
            reg = regTypeEnglish;
            break;
        case "englishOnly":
            reg = regTypeEnglishOnly;
            break;
        default :
            reg = regType;
    }
    const subCheck = ['$ne','$lt','$gt','$lte','$gte'];
    if(!reg.test(str))
        return false;
    for(const sub of subCheck){
        if(str.indexOf(sub)!==-1)
            return false;
    }
    return true;
};

module.exports = (str, type) => checkReg(str, type);