
jQuery(document).ready(function () {
    $(".image_border").css('height', 'auto');
});

function updateImg(){
    let file = document.getElementById('imgInput');
    let formData = new FormData();

    if (!file.value) return; // 파일이 없는 경우 빠져나오기

    formData.append('picRaw', file.files[0]);

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

    const url = document.location.href.split("/");
    const id = url[url.length-1];
    $.ajax({
        contentType: false,
        processData: false,
        method: "PUT",
        type: "PUT",
        url: "/piece/update/"+id,
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

function saveUpdateOne(){
    //jQuery.ajaxSettings.traditional=true;
    const url = document.location.href.split("/");
    const id = url[url.length-1];

    $.ajax({
        method: "PUT",
        type: "PUT",
        url: "/piece/update1/"+id,
        success: function (data) {
            if (data === "clear") {
                window.location.replace('/piece/update2/'+id);
                return true;
            }else {
                alert("작품 사진을 등록 해 주세요.");
                return false;
            }
        }
    });
}