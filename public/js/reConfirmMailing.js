function reMailing(){
    $.ajax({
        method: "POST",
        type: "POST",
        url: "/user/re_mailing",
        success: function (data) {
            if (data === "clear") {
                $('.check').text('가입시 입력한 메일로 인증메일이 발송되었습니다. 메일 인증을 해주세요.');
                return true;
            }else {
                $('.check').text(data);
                return false;
            }
        }
    });
}