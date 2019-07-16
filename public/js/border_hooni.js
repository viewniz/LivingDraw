 
// var windowWidth = $( window ).width();

// var windowWidth = $(window).resize($( window ).width());
// function top_fixed(){
//   var windowWidth = $( window ).width();
//   if (windowWidth<1025){
//    $( document ).ready( function() {
//     var jbOffset = $( '.target-hover' ).offset();
//     $( window ).scroll( function() {
//       if ( $( document ).scrollTop() > jbOffset.top ) {
//         $( '.target-hover' ).addClass( 'jbFixed' );
//       }
//       else {
//         $( '.target-hover' ).removeClass( 'jbFixed' );
//       }
//     });
//   });
//  }
//  else{
//   ;
// }
// }
// $( window ).resize(top_fixed(){
// }

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