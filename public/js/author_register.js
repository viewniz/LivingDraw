jQuery(document).ready(function () {

    $(".next").hover(function () {
        $('#hidden_next').css("transform", "translateX(0%)");
    }, function () {
        $('#hidden_next').css("transform", "translateX(100%)");
    });

    $(".pre_next").hover(function () {
        $('#hidden_pre_next').css("transform", "translateX(0%)");
    }, function () {
        $('#hidden_pre_next').css("transform", "translateX(-100%)");
    });


    $(function () {
        $('#btn-upload').click(function (e) {
            e.preventDefault();
            $('#imgInput').click();

        });
    });

    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#image_section').attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    $("#imgInput").change(function () {
        readURL(this);
        $(".image_border").css('height', 'auto');
    });
});