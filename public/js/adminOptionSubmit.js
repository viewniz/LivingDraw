function optionSubmit(val){
    let item = {type:val.type.value, value:val.value.value, valueE:val.valueE.value, option:val.option.value};
    $.ajax({
        method: "POST",
        type: "POST",
        url: "/admin/site/option/submit",
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
