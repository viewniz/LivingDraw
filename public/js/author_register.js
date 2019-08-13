jQuery(document).ready(function () {
    $(".next").hover(function () {
        $('#hidden_next').css("transform", "translateX(0%)");
    }, function () {
        $('#hidden_next').css("transform", "translateX(100%)");
    });
});