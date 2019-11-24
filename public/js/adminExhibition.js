function deleteExhibition(val){
    let item = {id:val};
    jQuery.ajaxSettings.traditional=true;
    $.ajax({
        method: "POST",
        type: "POST",
        url: "/admin/exhibition/delete",
        data: item,
        success: function (data) {
            if (data === "clear") {
                location.reload();
            }
        }
    });
}