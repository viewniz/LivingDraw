
jQuery(document).ready(function() {
    /*금액 ,찍기*/
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    var buy_price = $('.buy_title').text().split('￦');
    buy_price = buy_price[0];
    var new_price = numberWithCommas(buy_price);
    $('.buy_title').text(new_price + '￦');

});