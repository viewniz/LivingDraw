function removePiece(id){
    const data = {id:id};
    $.ajax({
        method: "POST",
        type: "POST",
        data: data,
        url: "/piece/remove",
        success: function (data) {
            if (data === "clear") {
                window.location.reload();
                return true;
            }else {
                alert(data);
                return false;
            }
        }
    });
}