$( document ).ready( function() {
    var jbOffset = $( '.target-hover' ).offset();
    $( window ).scroll( function() {
        if ( $( document ).scrollTop() > jbOffset.top ) {
            $( '.target-hover' ).addClass( 'jbFixed' );
        }
        else {
            $( '.target-hover' ).removeClass( 'jbFixed' );
        }
    });
});