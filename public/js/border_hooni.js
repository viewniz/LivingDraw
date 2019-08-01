$(document).ready(function () {
    var jbOffset = $('.target-hover').offset();
    $(window).scroll(function () {
        if ($(document).scrollTop() > jbOffset.top) {
            $('.target-hover').addClass('jbFixed');
        } else {
            $('.target-hover').removeClass('jbFixed');
        }
    });

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

    /*금액 ,찍기*/
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    var buy_price = $('.buy_title').text().split('￦');
    for (var start = 0; start < 9; start++) {
        var new_buy_price = buy_price[start];
        var new_price = numberWithCommas(new_buy_price);
        var buy_title = "#buy_title"+start;
        $(buy_title).text(new_price + '￦');
    }
});

