function permissionSeller(val){
    let item = {id:val};
    $.ajax({
        method: "PUT",
        type: "PUT",
        url: "/admin/user/permissionSeller",
        data: item,
        success: function (data) {
            if (data === "clear") {
                location.reload();
            }
            else
                alert(data);
        }
    });
}
