
jQuery(document).ready(function () {
    if(picFileName)
        $(".image_border").css('height', 'auto');
});

function uploadImg(){
    let file = document.getElementById('imgInput');
    let formData = new FormData();

    if (!file.value) return; // 파일이 없는 경우 빠져나오기

    formData.append('pic', file.files[0]);

    $.ajax({
        contentType: false,
        processData: false,
        method: "POST",
        type: "POST",
        url: "/piece/upload",
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

function saveUploadOne(){
    //jQuery.ajaxSettings.traditional=true;
    if(!picFileName)
    {
        alert("작품 사진을 등록 해 주세요.");
        return false;
    }
    else
    {
        window.location.replace('/piece/upload2');
        return true;
    }
}