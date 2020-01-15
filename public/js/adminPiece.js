function deletePiece(id){
    const data = {id:id};
    $.ajax({
        method: "DELETE",
        type: "DELETE",
        data: data,
        url: "/piece",
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