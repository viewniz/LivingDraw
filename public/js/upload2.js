jQuery(document).ready(function () {

    window.onmousedown = function (e) {

        if (e.target.id === "mediume") {
            console.log("sibal");
            return;
        }
        var el = e.target;
        if (el.value === "mediume1" || el.value === "mediume2" || el.value === "mediume3" || el.value === "mediume4" || el.value === "mediume5" ||
            el.value === "mediume6" || el.value === "mediume7" || el.value === "mediume8" || el.value === "mediume9" || el.value === "mediume10") {
            if (el.tagName.toLowerCase() == 'option' && el.parentNode.hasAttribute('multiple')) {

                // save scroll state
                // var yeOldeScroll = el.scrollTop;

                // toggle selection
                if (el.hasAttribute('selected')) {
                    e.preventDefault();
                    el.removeAttribute('selected');
                    removeFun(el.value);
                    // el.scrollTop = yeOldeScroll;
                    return
                } else el.setAttribute('selected', '');

                // el.scrollTop = yeOldeScroll;
                var component = el;
                plusFun(component);

                // hack to correct buggy behavior
                var select = el.parentNode.cloneNode(true);
                el.parentNode.parentNode.replaceChild(select, el.parentNode);
            }
        } else if (el.value === "plate1" || el.value === "plate2" || el.value === "plate3" || el.value === "plate4" || el.value === "plate5" ||
            el.value === "plate6" || el.value === "plate7" || el.value === "plate8" || el.value === "plate9" || el.value === "plate10" ||
            el.value === "plate11" || el.value === "plate12") {
            if (el.tagName.toLowerCase() == 'option' && el.parentNode.hasAttribute('multiple')) {
                e.preventDefault();
                // save scroll state
                // var yeOldeScroll = el.scrollTop;

                // toggle selection
                if (el.hasAttribute('selected')) {
                    el.removeAttribute('selected');
                    removeFun(el.value);
                    // el.scrollTop = yeOldeScroll;
                    return
                } else el.setAttribute('selected', '');

                // el.scrollTop = yeOldeScroll;
                var component = el;
                plusFun2(component);

                // hack to correct buggy behavior
                var select = el.parentNode.cloneNode(true);
                el.parentNode.parentNode.replaceChild(select, el.parentNode);
            }
        }

    };

    function removeFun(com) {
        // console.log(com); //el.className
        // var com_v2 = com+".";
        // console.log(com_v2);
        $('.' + com).remove(); //el.className찾아 삭제
    }
});

// "추가" 버튼 클릭시 실행 되는 함수 입니다.
function plusFun(com) {
    // var a = 1;
    //plusUl 변수에 createElement 를 사용해 생성할 엘리먼트를 담습니다.
    var plusUl = document.createElement('li');
    // 추가할 plusUl 엘리먼트 안의 내용을 정해줍니다. ( 꼭 정해야 하는건 아닙니다. )
    plusUl.innerHTML = com.text;
    // console.log(com.val);
    // appendChild 로 이전에 정의한 plusUl 변수의 내용을 실제 추가합니다.
    document.getElementById('mediume_part').appendChild(plusUl).className = com.value; //class명에 value값 삽입

}

function plusFun2(com) {
    // var a = 1;
    //plusUl 변수에 createElement 를 사용해 생성할 엘리먼트를 담습니다.
    var plusUl = document.createElement('li');
    // 추가할 plusUl 엘리먼트 안의 내용을 정해줍니다. ( 꼭 정해야 하는건 아닙니다. )
    plusUl.innerHTML = com.text;
    // console.log(com.val);
    // appendChild 로 이전에 정의한 plusUl 변수의 내용을 실제 추가합니다.
    document.getElementById('plate_part').appendChild(plusUl).className = com.value; //class명에 value값 삽입

}

function uploadImg(){
    let file = document.getElementById('imgInput');
    let formData = new FormData();

    if (!file.value) return; // 파일이 없는 경우 빠져나오기

    formData.append('pic', file.files[0]);

    $.ajax({
        contentType: false,
        processData: false,
        method: "POST",
        type: "POST",
        url: "/piece/upload",
        data: formData,
        success: function (data) {
            if (data === "clear") {
                picFileName="clear";
                return true;
            }else {
                //$('.check').text(data);
                alert("실 패");
                return false;
            }
        }
    });
}


