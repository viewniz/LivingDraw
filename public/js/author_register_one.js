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
    let item = {phoneNumber:data.phoneNumber.value};
    //jQuery.ajaxSettings.traditional=true;

    $.ajax({
        method: "POST",
        type: "POST",
        url: "/user/submit/smsVerification",
        data: item,
        success: function (data) {
            if (data === "clear") {
                //location.replace('/border');
                $( '.cert_token' ).append( '<p>인증 번호</p><div class="phone_number_bord">' +
                    '<input id="token_number_input" class="form-control number-form" name="token" placeholder="인증번호" type="text">' +
                    '<button id="token_number_box" class="btn btn-primary" type="button" onclick="phoneCert(this.form)">인증하기</button></div>' );
                $('#phone_number_box').text("다시받기");
                return true;
            }else {
                //$('.check').text(data);
                alert("실 패");
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
                certPhone = true;
                return true;
            }else {
                //$('.check').text(data);
                alert("실 패");
                return false;
            }
        }
    });
}

function saveAuthorOne(data){
    if(isPhoneCert!=="true")
    {
        alert("?");
        //$('#phone_number_input').focus();
        //$('#token_number_input').focus();
        return false;
    }
    const firstNameE = $('#firstNameE').val();
    const lastNameE  = $('#lastNameE').val();
    console.log(firstNameE);
    let item = {lastNameE:lastNameE, firstNameE:firstNameE};
    //jQuery.ajaxSettings.traditional=true;

    $.ajax({
        method: "POST",
        type: "POST",
        url: "/user/submit/author_register",
        data: item,
        success: function (data) {
            if (data === "clear") {
                window.location.replace('/user/author_register2');
                return true;
            }else {
                //$('.check').text(data);
                alert("실 패");
                return false;
            }
        }
    });
}