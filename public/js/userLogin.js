function loginPost(data){
    let item = {email:data.email.value,password:data.password.value};
    //jQuery.ajaxSettings.traditional=true;
    if(!item.email)
    {
        $('.check').text('이메일을 입력하세요.');
        $('#id').focus();
        return false;
    }
    if(!item.password)
    {
        $('.check').text('패스워드를 입력하세요.');
        $('#pass').focus();
        return false;
    }
    if(checkRegLogin(item.email,item.password)===1)
    {
        $('.check').text('이메일 형식을 지켜주세요 ex)example@livingdraw.co.kr');
        $('#id').focus();
        return false;
    }
    if(checkRegLogin(item.email,item.password)===2)
    {
        $('.check').text('비밀번호는 영어, 숫자, 특수문자 혼용으로 8~24 글자입니다.');
        $('#pass').focus();
        return false;
    }
    $.ajax({
        method: "POST",
        type: "POST",
        url: "/user/login",
        data: item,
        success: function (data) {
            if (data === "clear") {
                location.replace('/border');
                return true;
            }else {
                $('.check').text(data);
                return false;
            }
        }
    });
}

function checkRegLogin(id,password)
{
    const idCheck = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    const subCheck1 = '$ne';
    const subCheck2 = '$lt';
    const subCheck3 = '$gt';
    const subCheck4 = '$lte';
    const subCheck5 = '$gte';
    if(!idCheck.test(id) || !(id.indexOf(subCheck1)===-1) || !(id.indexOf(subCheck2)===-1) || !(id.indexOf(subCheck3)===-1) || !(id.indexOf(subCheck4)===-1) || !(id.indexOf(subCheck5)===-1))
    {
        return 1;
    }
    const pwCheck = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,24}$/;
    if(!pwCheck.test(password) || !(password.indexOf(subCheck1)===-1) || !(password.indexOf(subCheck2)===-1) || !(password.indexOf(subCheck3)===-1) || !(password.indexOf(subCheck4)===-1) || !(password.indexOf(subCheck5)===-1))
    {
        return 2;
    }
    return 3;
}