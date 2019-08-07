$(document).ready(function () {

    var curPage = document.URL;
    // var pre_value = curPage.indexOf("/");
    // alert(pre_value);
    curPage = curPage.substr(curPage.lastIndexOf("/") + 1);

    var curPage_sort = curPage.split('?');
    var str_page = String(curPage_sort[0]);
    // var num_page = parseInt(curPage); //맥시멈구하기
    var str_pagename = "pagenum" + str_page;

    if (str_page != "") {
        $('#' + str_pagename).addClass('clickcolor'); // 나타내기
        if (str_page == '1') {
            $('#pageleft').addClass('displaynone'); // 없애기
        }
    }
});



