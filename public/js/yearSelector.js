(function($) {
    $.fn.yearSelector = function(options) {
        if(this.length === 0) {
            return this;
        }

        // 기본값과 옵션을 결합하여 설정값을 만듭니다.
        let date = new Date();
        let settings = $.extend({
            startYear   : 1980,
            endYear     : date.getFullYear(),
            currentYear : date.getFullYear()}, options);

        // 설정값으로 콤보박스의 옵션을 생성합니다.
        this.each(function() {
            let selectBox = $(this);
            selectBox.empty();
            if(settings.endYear >= settings.startYear) {
                for(var i = settings.endYear; i >= settings.startYear; i--) {
                    selectBox.append($('<option>', {text:i, value:i}));
                }
                // 현재 년도를 기본 값으로 합니다.
                selectBox.val(settings.currentYear);
            }
        });

        // 선택박스의 전체 데이터를 교체 합니다. - public 함수
        this.setData = function(datas) {
            if(datas == null) return;

            this.each(function() {
                let selectBox = $(this);
                selectBox.empty();
                $.each(datas, function(i, opt) {
                    selectBox.append($('<option>', opt));
                });
            });
            return this;
        };

        return this;
    };
}(jQuery));

$(document).ready(function() {
    // 기본 생성 및 현재값 지정하기
    $("#year").yearSelector().val();
});