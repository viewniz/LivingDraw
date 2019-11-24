
jQuery(document).ready(function () {
    if(picFileName)
        $(".image_border").css('height', 'auto');
});

function uploadImg(){
    let file = document.getElementById('imgInput');
    let formData = new FormData();

    if (!file.value) return; // 파일이 없는 경우 빠져나오기

    formData.append('student_Iden', file.files[0]);

    const file_kind = file.value.lastIndexOf('.');
    const file_name = file.value.substring(file_kind + 1, file.length).toLowerCase();
    const file_size = file.files[0].size || file.files[0].fileSize;
    const limit = 20000000;

    let check_file_type=['jpg','jpeg'];

    if(check_file_type.indexOf(file_name)===-1){
        alert('이미지 파일만 선택할 수 있습니다.');
        return false;
    }
    if(file_size>limit)
    {
        alert('20MB 이하의 파일만 선택할 수 있습니다.');
        return false;
    }
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
                alert("실 패");
                return false;
            }
        }
    });
}

function saveAuthorTwo(){
    $.ajax({
        method: "POST",
        type: "POST",
        url: "/user/submit/author_register2",
        success: function (data) {
            if (data === "clear") {
                window.location.replace('/user/author_register3');
                return true;
            }else {
                alert("학생증을 등록 해 주세요");
                return false;
            }
        }
    });
}
