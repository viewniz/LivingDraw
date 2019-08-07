function submitPost(data){
    let item = {email:data.email.value,password:data.password.value,lastName:data.lastName.value,firstName:data.firstName.value};
    //jQuery.ajaxSettings.traditional=true;
    if(!item.email)
    {
        alert("이메일 입력");
        return false;
    }
    $.ajax({
        method: "POST",
        type: "POST",
        url: "/user/submit",
        data: item,
        success: function (data) {
            if (data === "clear") {
                location.replace('/user/login');
                return true;
            }else {
                $('.check').text(data);
                return false;
            }
        }
    });
}