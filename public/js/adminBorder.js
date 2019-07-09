function deleteBorder(val){
    let item = {id:val};
    jQuery.ajaxSettings.traditional=true;
    $.ajax({
        method: "POST",
        type: "POST",
        url: "/admin/border/delete",
        data: item,
        success: function (data) {
            if (data === "clear") {
                location.reload();
            }
        }
    });
}

function isSellingChange(val){
    let item = {id:val};
    jQuery.ajaxSettings.traditional=true;
    $.ajax({
        method: "POST",
        type: "POST",
        url: "/admin/border/isSellingChange",
        data: item,
        success: function (data) {
            if (data === "clear") {
            }
        }
    });
}
$("input[type='checkbox']").change(function() {
    var checked = $(this).prop('checked');  // checked 상태 (true, false)
    var $label = $(this).parent().next();            // find a label element
    var $label2 = $label.next();
    // checked ? $label.css('background-color', value) : $label.css('background-color', 'white');
    if(checked)
    {$label.toggle();
        $label2.toggle();}
         // label의 배경색을 바꾼다.
    else
    {$label.toggle();
        $label2.toggle();}   // label의 배경색을 초기화 한다.
});