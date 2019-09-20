function uploadThree() {
    const frm = document.forms.three;
    const width = frm.width.value;
    const height = frm.height.value;
    const depth = frm.depth.value;
    const price = frm.price.value;
    const description = frm.description.value;

    const regType = /^[ㄱ-ㅎㅏ-ㅣ가-힣+]{1,50}$/;
    const regTypeE = /^[A-Za-z+]{1,50}$/;

    let keyWords = '';
    for (let i = 0; i < document.getElementsByClassName("keywordList").length; i++) {
        keyWords+=document.getElementsByClassName('keywordList')[i].innerText+',';
    }
    keyWords=keyWords.substr(0,keyWords.length-1);
    /*if(subject==="주제선택" || !subject)
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
    }*/
    const item = {width: width, height: height, depth: depth, price: price, description: description, keyWords: keyWords};
    $.ajax({
        method: "POST",
        type: "POST",
        url: "/piece/upload3",
        data: item,

        success: function (data) {
            if (data === "clear") {
                window.location.replace('/border');
                return true;
            } else {
                alert("실 패");
                return false;
            }
        }
    });
}