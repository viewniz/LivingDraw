function deleteAdmin(val){
    let item = {id:val};
    jQuery.ajaxSettings.traditional=true;
    $.ajax({
        method: "DELETE",
        type: "DELETE",
        url: "/admin/member/delete",
        data: item,
        success: function (data) {
            if (data === "clear") {
                location.reload();
            }else
                alert(data);
        }
    });
}