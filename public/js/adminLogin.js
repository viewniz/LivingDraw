function checkIdPassForm()
{
    var idCheck = /^[a-z0-9]+[a-z0-9]{6,24}$/g;
    if(!idCheck.test(loginForm.id.value))
    {
        alert("아이디는 영어와 숫자만 들어갈 수 있습니다.(글자수는 6~24)");
        loginForm.id.focus();
        return false;
    }
    var pwCheck = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{6,24}$/;
    if(!pwCheck.test(loginForm.password.value))
    {
        alert("비밀번호는 영어,숫자,특수문자 조합입니다.(글자수는 6~24)");
        loginForm.password.focus();
        return false;
    }
    return true;
}

