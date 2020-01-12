jQuery(document).ready(function () {

    if(firstNameE!==null)
    {
        $('#firstNameE').attr('value',firstNameE);
    }
    if(lastNameE!==null)
    {
        $('#lastNameE').attr('value',lastNameE);
    }
    if(isPhoneCert==="true"){
        $( '.cert_token' ).append( '<p>인증 번호</p><div class="phone_number_bord">' +
            '<input id="token_number_input" class="form-control number-form" name="token" placeholder="인증번호" type="text">' +
            '<button id="token_number_box" class="btn btn-primary" type="button" onclick="phoneCert(this.form)">인증하기</button></div>' );
        $('#phone_number_input').attr('value',phoneNumber);
        $('#phone_number_input').attr('readOnly','true');
        $('#token_number_input').attr('readOnly','true');
        $('#phone_number_box').hide();
        $('#token_number_box').attr("onclick","");
        $('#token_number_box').text("인증완료");
    }
});


function phoneNumberCheck(data){
    const item = {phoneNumber:data.phoneNumber.value};
    $.ajax({
        method: "POST",
        type: "POST",
        url: "/user/submit/smsVerification",
        data: item,
        success: function (data) {
            if (data === "clear") {
                $( '.cert_token' ).append( '<p>인증 번호</p><div class="phone_number_bord">' +
                    '<input id="token_number_input" class="form-control number-form" name="token" placeholder="인증번호" type="text">' +
                    '<button id="token_number_box" class="btn btn-primary" type="button" onclick="phoneCert(this.form)">인증하기</button></div>' );
                $('#phone_number_box').text("다시받기");
                return true;
            }else {
                alert(data);
                return false;
            }
        }
    });
}

function phoneCert(data){
    let item = {token:data.token.value};
    //jQuery.ajaxSettings.traditional=true;
    $.ajax({
        method: "POST",
        type: "POST",
        url: "/user/submit/phoneVerification",
        data: item,
        success: function (data) {
            if (data === "clear") {
                $('#phone_number_input').attr('readOnly','true');
                $('#token_number_input').attr('readOnly','true');
                $('#phone_number_box').hide();
                $('#token_number_box').attr("onclick","");
                $('#token_number_box').text("인증완료");
                return true;
            }else {
                alert(data);
                return false;
            }
        }
    });
}

function saveAuthorOne(data){
    const firstNameE = $('#firstNameE').val();
    const lastNameE  = $('#lastNameE').val();
    let item = {lastNameE:lastNameE, firstNameE:firstNameE};
    const regType = /^[A-Za-z+]{1,50}$/;
    /*if(!regType.test(lastNameE))
    {
        alert('영문만 입력 가능합니다.성');
        $('#lastNameE').focus();
        return false;
    }
    if(!regType.test(firstNameE))
    {
        alert('영문만 입력 가능합니다.');
        $('#firstNameE').focus();
        return false;
    }*/
    /*if(isPhoneCert!=="true")
    {
        alert("휴대폰 인증을 해주세요.");
        $('#phone_number_input').focus();
        return false;
    }*/
    $.ajax({
        method: "POST",
        type: "POST",
        url: "/user/submit/author_register",
        data: item,
        success: function (data) {
            if (data === "clear") {
                window.location.replace('/user/author_register2');
                return true;
            }else if(data === "Error PhoneCert")
            {
                alert("휴대폰 인증을 해주세요.");
                $('#phone_number_input').focus();
                return false;
            }
            else {
                alert(data);
                return false;
            }
        }
    });
}