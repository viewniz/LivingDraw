jQuery(document).ready(function(){

    $('.nav-toggle-label').on({
        'click': function(){
            $('.btn_close').removeClass('non_display');
            $('#nav_boundary_id').addClass('nav_boundary');
        }
    });

    $('.btn_close').on({
        'click': function(){
            $('.btn_close').addClass('non_display');
            $('#nav_boundary_id').removeClass('nav_boundary');
        }
    });

});