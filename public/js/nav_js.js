jQuery(document).ready(function(){

    $('.nav-toggle-label').on({
        'click': function(){
            $('#nav_boundary_id').addClass('nav_boundary');
            $("body").addClass('layer-open'); //overflow:hidden 추가
        }
    });

    $('.btn_close').on({
        'click': function(){
            $('#nav_boundary_id').removeClass('nav_boundary');
            $("body").removeClass('layer-open'); //overflow:hidden 추가
        }
    });

});