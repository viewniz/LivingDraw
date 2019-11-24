function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $(input).next().children('img').attr('src', e.target.result);
            $(input).next().css('display','inline-block');
        };
        reader.readAsDataURL(input.files[0]);
    }
}

$("input[type='file']").change(function() {
    readURL(this);
});

function removeImage(val,val2){
    let item = {num:val,id:val2};
    jQuery.ajaxSettings.traditional=true;
    $.ajax({
        method: "POST",
        type: "POST",
        url: "/admin/border/update/removeImage",
        data: item,
        success: function (data) {
            if (data === "clear") {
                location.reload();
            }
        }
    });
}

$(function() {
    var $input = $("#priceString");
    $input.on('keyup', function() {
        // 입력 값 알아내기
        var _this = this;
        numberFormat(_this);
    })
});

// 콤마 찍기
function comma(str) {
    str = String(str);
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
}

// 콤마 풀기
function uncomma(str) {
    str = String(str);
    return str.replace(/[^\d]+/g, '');
}

function numberFormat(obj) {
    obj.value = comma(uncomma(obj.value));
}

function appendYear($select){

    var date = new Date();
    var year = date.getFullYear();
    var idx = 0;
    for(var i=year-50; i<=year; i++){
        $select.prepend("<option value='"+i+"'>"+i+"</option>");
        idx++;
    }
    $select.find("option:eq(0)").prop("selected", true); // 현재년도 선택
}

appendYear($("#year"));