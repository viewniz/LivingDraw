jQuery(document).ready(function () {

    $('#keyword').on("keydown", function (e) {
        var el = e.target;
        if (e.keyCode === 13) {
            plusel(el);
        }
        ;
    });

    $('#keyword_part').on('click', 'li', function () {
        $(this).remove();
    });

});

function plusel(com) {
    var plusUl = document.createElement('li');
    plusUl.innerHTML = com.value + "<i class='flaticon-close-button'></i>";
    document.getElementById('keyword_part').appendChild(plusUl);
    com.value = '';
}