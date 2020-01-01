jQuery(document).ready(function () {

    window.onmousedown = function (e) {

        if (e.target.id === "mediume") {
            return;
        }
        var el = e.target;
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
            if(el.parentNode.name==='medium')
                plusFun(component);
            else if(el.parentNode.name==='style')
                plusFun3(component);
            else
                plusFun2(component);

            // hack to correct buggy behavior
            var select = el.parentNode.cloneNode(true);
            el.parentNode.parentNode.replaceChild(select, el.parentNode);
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

function plusFun3(com) {
    // var a = 1;
    //plusUl 변수에 createElement 를 사용해 생성할 엘리먼트를 담습니다.
    var plusUl = document.createElement('li');
    // 추가할 plusUl 엘리먼트 안의 내용을 정해줍니다. ( 꼭 정해야 하는건 아닙니다. )
    plusUl.innerHTML = com.text;
    // console.log(com.val);
    // appendChild 로 이전에 정의한 plusUl 변수의 내용을 실제 추가합니다.
    document.getElementById('style_part').appendChild(plusUl).className = com.value; //class명에 value값 삽입
}

