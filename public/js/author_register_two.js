
jQuery(document).ready(function () {
    if(picFileName)
        $(".image_border").css('height', 'auto');
});

function uploadImg(){
    let file = document.getElementById('imgInput');
    let formData = new FormData();

    if (!file.value) return; // 파일이 없는 경우 빠져나오기

    formData.append('student_Iden', file.files[0]);

    $.ajax({
        contentType: false,
        processData: false,
        method: "POST",
        type: "POST",
        url: "/user/submit/upload_stuiden",
        data: formData,
        success: function (data) {
            if (data === "clear") {
                return true;
            }else {
                //$('.check').text(data);
                alert("실 패");
                return false;
            }
        }
    });
}

function saveAuthorTwo(){
    //jQuery.ajaxSettings.traditional=true;
    if(!picFileName)
    {
        alert("학생증을 등록해 주세요.");
        return false;
    }
    $.ajax({
        method: "POST",
        type: "POST",
        url: "/user/submit/author_register2",
        success: function (data) {
            if (data === "clear") {
                window.location.replace('/user/author_register3');
                return true;
            }else {
                //$('.check').text(data);
                alert("실 패");
                return false;
            }
        }
    });
}