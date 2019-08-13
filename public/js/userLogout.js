function loginOut(){
    $.ajax({
        method: "POST",
        type: "POST",
        url: "/user/logout",
        data: item,
        success: function (data) {
            if (data === "clear") {
                Location.reload();
                return true;
            }
        }
    });
}