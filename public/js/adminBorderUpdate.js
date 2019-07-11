function readURL(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $(this).next().next().attr('src', e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
    }
}

$(".imgInput").change(function(){
    readURL(this);
});