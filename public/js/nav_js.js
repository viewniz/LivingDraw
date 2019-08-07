jQuery(document).ready(function () {

    $('.nav-toggle-label').on({
        'click': function () {
            $('#nav_boundary_id').addClass('nav_boundary');
            $("body").addClass('layer-open'); //overflow:hidden 추가
        }
    });

    $('.btn_close').on({
        'click': function () {
            $('#nav_boundary_id').removeClass('nav_boundary');
            $("body").removeClass('layer-open'); //overflow:hidden 추가
        }
    });

    // Hide Header on on scroll down
    var didScroll;
    var lastScrollTop = 0;
    var delta = 5;
    var navbarHeight = $('.mainheader').outerHeight();

    $(window).scroll(function (event) {
        didScroll = true;
    });

    setInterval(function () {
        if (didScroll) {
            hasScrolled();
            didScroll = false;
        }
    }, 250);

    function hasScrolled() {
        var st = $(this).scrollTop();

        // Make sure they scroll more than delta
        if (Math.abs(lastScrollTop - st) <= delta)
            return;

        // If they scrolled down and are past the navbar, add class .nav-up.
        // This is necessary so you never see what is "behind" the navbar.
        if (st > lastScrollTop && st > navbarHeight) {
            // Scroll Down
            $('.mainheader').removeClass('nav-down').addClass('nav-up');
        } else {
            // Scroll Up
            if (st + $(window).height() < $(document).height()) {
                $('.mainheader').removeClass('nav-up').addClass('nav-down');
            }
        }

        lastScrollTop = st;
    }

});