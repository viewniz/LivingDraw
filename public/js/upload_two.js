function uploadTwo() {
    const frm = document.forms.two;
    const subject = frm.subject.value;
    const style = frm.style.value;
    const title = frm.title.value;
    const titleSub = frm.titleSub.value;
    let medium = '';
    let material = '';
    const regType = /^[ㄱ-ㅎㅏ-ㅣ가-힣0-9:,?!()+]{1,50}$/;
    const regTypeE = /^[A-Za-z0-9:,+?!()]{1,50}$/;
    for (let i = 0; i < frm.medium.length; i++) {
        if (frm.medium.options[i].selected === true) {
            medium+=frm.medium.options[i].value+',';
        }
    }
    medium=medium.substr(0,medium.length-1);
    for (let i = 0; i < frm.material.length; i++) {
        if (frm.material.options[i].selected === true) {
            material+=frm.material.options[i].value+',';
        }
    }
    material=material.substr(0,material.length-1);
    if(subject==="주제선택" || !subject)
    {
        alert("주제를 입력하세요.");
        return false;
    }
    if(style==="스타일선택" || !style)
    {
        alert("스타일을 입력하세요.");
        return false;
    }
    if(title==="" || !title)
    {
        alert("제목을 입력하세요.");
        return false;
    }
    if(!regType.test(title))
    {
        alert("제목은 한글만 입력이 가능합니다.");
        return false;
    }
    if(titleSub==="" || !titleSub)
    {
        alert("부제목을 입력하세요.");
        return false;
    }
    if(!regTypeE.test(titleSub))
    {
        alert("부제목은 영문만 입력이 가능합니다.");
        return false;
    }
    if(medium==='' || !medium)
    {
        alert("재료를 입력하세요.");
        return false;
    }
    if(material==='' || !material)
    {
        alert("종이를 입력하세요.");
        return false;
    }
    const item = {subject: subject, style: style, title: title, titleSub: titleSub, medium: medium, material: material};
    $.ajax({
        method: "POST",
        type: "POST",
        url: "/piece/upload2",
        data: item,

        success: function (data) {
            if (data === "clear") {
                window.location.replace('/piece/upload3');
                return true;
            } else {
                alert("실 패");
                return false;
            }
        }
    });
}