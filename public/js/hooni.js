jQuery(document).ready(function(){

	var vareiety_icon_attr= true;
	var click_action = true;
	var click_toggle = true;

	jQuery('#paintstory').on('click', function(event) {    
		if( vareiety_icon_attr === true){    
			jQuery('#paintdetail').toggle('show');
			$('#vareiety_icon').attr('class','icono-caretUp');
			vareiety_icon_attr=false;
		}
		else{
			jQuery('#paintdetail').toggle('show');
			$('#vareiety_icon').attr('class','icono-caretDown');
			vareiety_icon_attr=true;
		}
	});

	$('#leftside_detail_1').on({
		'click': function(){
			var image = $('#select_image_1').attr('src');
			$('#leftside_detail_1').attr('class','leftside_detail');
			$( '#leftside_detail_2').attr('class','leftside_normal');
			$( '#leftside_detail_3').attr('class','leftside_normal');
			$('#select_image').attr('src',image);
		}
	});

	$('#leftside_detail_2').on({
		'click': function(){
			var image = $('#select_image_2').attr('src');
			$('#leftside_detail_2').attr('class','leftside_detail');
			$('#leftside_detail_1').attr('class','leftside_normal');
			$('#leftside_detail_3').attr('class','leftside_normal');
			$('#select_image').attr('src',image);
		}
	});

	$('#leftside_detail_3').on({
		'click': function(){
			var image = $('#select_image_3').attr('src');
			$('#leftside_detail_3').attr('class','leftside_detail');
			$( '#leftside_detail_2').attr('class','leftside_normal');
			$( '#leftside_detail_1').attr('class','leftside_normal');
			$('#select_image').attr('src',image);
		}
	});

	$(document).ready(function () {
		$('.middle2')
		.mouseover(function () {
			$('#add_like').attr("src", "../images/like.png");
		})
		.mouseout(function () {
			$('#add_like').attr("src", "../images/like4.png");
		});
	});

	$(document).ready(function () {
		$('#paintstory')
		.mouseover(function () {
			$('#shadow').attr("style", "box-shadow: 10px 13px 30px rgba(0, 0, 0, 0.5);");
		})
		.mouseout(function () {
			$('#shadow').attr("style", "none");
		});
	});

	$(document).ready(function () {
		$('#paintstory')
		.mouseover(function () {
			$('#shadow').attr("style", "box-shadow: 10px 13px 30px rgba(0, 0, 0, 0.5);");
		})
		.mouseout(function () {
			$('#shadow').attr("style", "none");
		});
	});



	
	$('#mobile_searchbutton').on({
		'click': function(){
			// if(click_action === true){
			// 	$('#mobile_toggle_icon').css('margin-top','-1px');
			// }
			// else{
			// 	$('#mobile_toggle_icon').css('margin-top','7px');
			// }
			$('.search_icon').css("display", "none"); //  숨기기
			$('#searchbar_2').css("opacity",1); //검색창 나타내기
			$('#searchbar_2').css("padding",0); //
			$('#searchbar_2').css("padding-right",10);
			$('.navbar-brand').css("display","none");
			$('#search_icon_close').css("opacity",1);
			
		}
	});

	$('.fa-times').on({
		'click': function(){
			$('.search_icon').css("display", "block"); // 나타내기
			$('#searchbar_2').css("opacity",0); //검색창 숨기기
			$('#searchbar_2').css("padding-right",16); //
			$('.navbar-brand').css("display","block");
			$('#search_icon_close').css("opacity",0);
			$('#mobile_toggle_icon').css('display','block');

		}
	});

});