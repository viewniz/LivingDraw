jQuery(document).ready(function () {
    $(".next").hover(function () {
        $('#hidden_next').css("transform", "translateX(0%)");
    }, function () {
        $('#hidden_next').css("transform", "translateX(100%)");
    });
<<<<<<< HEAD

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


=======
>>>>>>> 327bb1d4b0dc963bec63cc2e887306900d22114e
});