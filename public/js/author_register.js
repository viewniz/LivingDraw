jQuery(document).ready(function () {

    $(".next").hover(function () {
        $('#hidden_next').css("transform", "translateX(0%)");
    }, function () {
        $('#hidden_next').css("transform", "translateX(100%)");
    });

    $(".pre_next").hover(function () {
        $('#hidden_pre_next').css("transform", "translateX(0%)");
    }, function () {
        $('#hidden_pre_next').css("transform", "translateX(-100%)");
    });


    $(function () {
        $('#btn-upload').click(function (e) {
            e.preventDefault();
            $('#imgInput').click();

        });
    });

    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#image_section').attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    $("#imgInput").change(function () {
        readURL(this);
        $(".image_border").css('height', 'auto');
    });
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
                return true;
            }else {
                //$('.check').text(data);
                alert("실 패");
                return false;
            }
        }
    });
}