function deleteExhibition(val){
    let item = {id:val};
    jQuery.ajaxSettings.traditional=true;
    $.ajax({
        method: "DELETE",
        type: "DELETE",
        url: "/admin/exhibition",
        data: item,
        success: function (data) {
            if (data === "clear") {
                location.reload();
            }
        }
    });
}