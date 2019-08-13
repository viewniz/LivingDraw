function submitPost(data){
    let item = {email:data.email.value,password:data.password.value,lastName:data.lastName.value,firstName:data.firstName.value};
    //jQuery.ajaxSettings.traditional=true;
    if(!item.lastName)
    {
        $('.check').text('성을 입력하세요.');
        $('#lastname').focus();
        return false;
    }
    if(!item.firstName)
    {
        $('.check').text('이름을 입력하세요.');
        $('#firstname').focus();
        return false;
    }
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

    if(checkRegName(item.lastName)===1)
    {
        $('.check').text('성은 한글만 입력이 가능합니다.');
        $('#lastname').focus();
        return false;
    }
    if(checkRegName(item.firstName)===1)
    {
        $('.check').text('이름은 한글만 입력이 가능합니다.');
        $('#firstname').focus();
        return false;
    }
    if(checkRegSubmit(item.email,item.password)===1)
    {
        $('.check').text('이메일 형식을 지켜주세요 ex)example@livingdraw.co.kr');
        $('#id').focus();
        return false;
    }
    if(checkRegSubmit(item.email,item.password)===2)
    {
        $('.check').text('비밀번호는 영어, 숫자, 특수문자 혼용으로 8~24 글자입니다.');
        $('#pass').focus();
        return false;
    }
    $.ajax({
        method: "POST",
        type: "POST",
        url: "/user/submit",
        data: item,
        success: function (data) {
            if (data === "clear") {
                location.replace('/user/login');
                return true;
            }else {
                $('.check').text(data);
                return false;
            }
        }
    });
}
function submitPostSocial(data){
    let item = {lastName:data.lastName.value,firstName:data.firstName.value};
    //jQuery.ajaxSettings.traditional=true;
    if(!item.lastName)
    {
        $('.check').text('성을 입력하세요.');
        $('#lastname').focus();
        return false;
    }
    if(!item.firstName)
    {
        $('.check').text('이름을 입력하세요.');
        $('#firstname').focus();
        return false;
    }
    if(checkRegName(item.lastName)===1)
    {
        $('.check').text('성은 한글만 입력이 가능합니다.');
        $('#lastname').focus();
        return false;
    }
    if(checkRegName(item.firstName)===1)
    {
        $('.check').text('이름은 한글만 입력이 가능합니다.');
        $('#firstname').focus();
        return false;
    }
    $.ajax({
        method: "POST",
        type: "POST",
        url: "/user/auth/social",
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
function checkRegSubmit(id,password)
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
function checkRegName(name)
{
    const nameCheck = /^[가-힣]+[가-힣]{0,30}$/g;
    const subCheck1 = '$ne';
    const subCheck2 = '$lt';
    const subCheck3 = '$gt';
    const subCheck4 = '$lte';
    const subCheck5 = '$gte';
    if(!nameCheck.test(name) || !(name.indexOf(subCheck1)===-1) || !(name.indexOf(subCheck2)===-1) || !(name.indexOf(subCheck3)===-1) || !(name.indexOf(subCheck4)===-1) || !(name.indexOf(subCheck5)===-1))
    {
        return 1;
    }
    return 2;
}