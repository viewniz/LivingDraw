 
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

  var curPage = document.URL;
  curPage = curPage.substr(curPage.lastIndexOf("/")+1) ;
  var curPage_sort = curPage.split('?');
  console.log(curPage);
  var str_page = String(curPage_sort[0]);
  console.log(str_page);
  // var num_page = parseInt(curPage); //맥시멈구하기
  var str_pagename = "pagenum"+str_page;

  if(str_page!="")
  {
    $('#'+str_pagename).addClass('clickcolor'); // 나타내기
    if(str_page=='1'){
      $('#pageleft').addClass('displaynone'); // 없애기
    }
  }




});

