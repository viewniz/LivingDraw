function uploadTwo() {
    const frm = document.forms.two;
    const subject = frm.subject.value;
    const style = frm.style.value;
    const title = frm.title.value;
    const titleSub = frm.titleSub.value;
    let medium = '';
    let material = '';

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