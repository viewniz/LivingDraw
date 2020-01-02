function updateThree() {
    const frm = document.forms.three;
    const width = frm.width.value;
    const height = frm.height.value;
    const depth = frm.depth.value;
    const price = frm.price.value;
    const production_year = frm.production_year.value;
    const description = frm.description.value;

    const regType = /^[ㄱ-ㅎㅏ-ㅣ가-힣A-Za-z0-9!@#$%^&*().,?;:'"~+]{0,1000}$/;
    const regTypeT = /^[ㄱ-ㅎㅏ-ㅣ가-힣A-Za-z0-9!@#$%^&*().,?;:'"~+]{1,50}$/;
    const regTypeN = /^[0-9+]{1,1000}$/;
    const regTypeP = /^[0-9,+]{1,1000}$/;
    const subCheck1 = '$ne';
    const subCheck2 = '$lt';
    const subCheck3 = '$gt';
    const subCheck4 = '$lte';
    const subCheck5 = '$gte';
    if(!regTypeN.test(width))
    {
        alert("가로 길이는 숫자만 입력 가능합니다.");
        document.getElementById('width').focus();
        return false;
    }
    if(!regTypeN.test(height))
    {
        alert("세로 길이는 숫자만 입력 가능합니다.");
        document.getElementById('height').focus();
        return false;
    }
    if(!regTypeN.test(depth))
    {
        alert("너비는 숫자만 입력 가능합니다.");
        document.getElementById('depth').focus();
        return false;
    }
    if(!regTypeP.test(price))
    {
        alert("가격은 숫자만 입력 가능합니다.");
        document.getElementById('price').focus();
        return false;
    }
    if(!regTypeN.test(production_year))
    {
        alert("제작년도는 숫자만 입력 가능합니다.");
        document.getElementById('production_year').focus();
        return false;
    }
    if(!regType.test(description) || !(description.indexOf(subCheck1)===-1) || !(description.indexOf(subCheck2)===-1) || !(description.indexOf(subCheck3)===-1)
        || !(description.indexOf(subCheck4)===-1) || !(description.indexOf(subCheck5)===-1))
    {
        alert("정당한 값을 입력하세요.");
        document.getElementById('description').focus();
        return false;
    }
    let keyWords = '';
    const keywordList = document.getElementsByClassName('keywordList');
    for (let i = 0; i < keywordList.length; i++) {
        if(!regTypeT.test(keywordList[i].innerText) || !(keywordList[i].innerText.indexOf(subCheck1)===-1) || !(keywordList[i].innerText.indexOf(subCheck2)===-1)
            || !(keywordList[i].innerText.indexOf(subCheck3)===-1) || !(keywordList[i].innerText.indexOf(subCheck4)===-1) || !(keywordList[i].innerText.indexOf(subCheck5)===-1))
        {
            alert("키워드는 50글자를 넘을 수 없습니다.");
            document.getElementById('keyword').focus();
            return false;
        }
        keyWords+=keywordList[i].innerText+',';
    }
    keyWords=keyWords.substr(0,keyWords.length-1);

    const item = {width: width, height: height, depth: depth, price: price, description: description, keyWords: keyWords, production_year: production_year};
    const url = document.location.href.split("/");
    const id = url[url.length-1];
    $.ajax({
        method: "POST",
        type: "POST",
        url: "/piece/update3/"+id,
        data: item,

        success: function (data) {
            if (data === "clear") {
                window.location.replace('/piece/admin');
                return true;
            } else {
                alert("실 패");
                return false;
            }
        }
    });
}

$(function() {
    var $input = $("#price");
    $input.on('keyup', function() {
        // 입력 값 알아내기
        var _this = this;
        numberFormat(_this);
        realMoney(_this);
    })
});

// 콤마 찍기
function comma(str) {
    str = String(str);
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
}

// 콤마 풀기
function uncomma(str) {
    str = String(str);
    return str.replace(/[^\d]+/g, '');
}

function numberFormat(obj) {
    obj.value = comma(uncomma(obj.value));
}

function realMoney(obj){
    const result = comma(parseInt((uncomma(obj.value)/1.1)*0.7));
    document.getElementById('realPrice').innerText = "실수령액 : "+result;
}

function beforePage() {
    const url = document.location.href.split("/");
    const id = url[url.length-1];
    window.location.replace('/piece/update2/'+id);
}