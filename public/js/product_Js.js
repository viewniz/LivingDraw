$( document ).ready( function() {
    var jbOffset = $( '.mainheader' ).offset();
    $( window ).scroll( function() {
        if ( $( document ).scrollTop() > jbOffset.top ) {
            $( '.mainheader' ).addClass( 'mainheader_display' );
        }
        else {
            $( '.mainheader' ).removeClass( 'mainheader_display' );
        }
    });
});