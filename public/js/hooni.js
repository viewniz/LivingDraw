jQuery(document).ready(function(){

	var vareiety_icon_attr= true;
	var click_action = true;
	var click_toggle = true;

	/*페이지 색깔 바꾸기*/
	var curPage = document.URL;
	var pre_value = curPage.split('/');
	// alert(pre_value[3]);
	pre_value = pre_value[3];
	if(pre_value === ''){
		$('.mainpage').addClass('pre_nav_color')
	}
	else if(pre_value === "border"){
		$('.borderpage').addClass('pre_nav_color')
	}






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

	//풀스크린//

	$('#modal_button').click(function(e) {
		var selectfunction = $('#select_image').attr('src'); ///로컬일때
		$('.change_fullscreen_img').attr("src",selectfunction);
		e.preventDefault();
	});

	// $('#modal_button').click(function(e) {
	// 	$('.modal').removeClass('active');
	// 	e.preventDefault();
	// });

	//end//

	$(document).ready(function () {
		$('.middle2')
		.mouseover(function () {
			$('#add_like').attr("src", "/images/like.png");
		})
		.mouseout(function () {
			$('#add_like').attr("src", "/images/like4.png");
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
			$('#searchbar_2').removeClass('non_display'); //  숨기기
			$('.search_icon').addClass('non_display');
			$('#searchbar_2').css("opacity",1);
			$('#searchbar_2').css("opacity",1); //검색창 나타내기
			$('#searchbar_2').css("padding",0); //
			$('#searchbar_2').css("padding-right",10);
			$('.navbar-brand').addClass('non_display');
			$('#search_icon_close').css("opacity",1);
		}
	});

	$('.fa-times').on({
		'click': function(){
			$('#searchbar_2').addClass('non_display'); //  숨기기
			$('.search_icon').removeClass('non_display'); // 나타내기
			$('#searchbar_2').css("opacity",0); //검색창 숨기기
			$('#searchbar_2').css("padding-right",16); //
			$('.navbar-brand').removeClass('non_display');
			$('#search_icon_close').css("opacity",0);
			$('#mobile_toggle_icon').css('display','block');
		}
	});


	let mobile_toggle_icon = false;


		$('#mobile_toggle_icon').on({
		'click': function() {

			if(mobile_toggle_icon === false){
				$('#searchbar_2').addClass('non_display'); //  숨기기
				$('.search_icon').addClass('non_display'); // 숨기기
				$('.navbar-brand').removeClass('non_display');// 나타내기
				mobile_toggle_icon = true;
			}
			else{
				$('.search_icon').removeClass('non_display'); // 나타내기
				mobile_toggle_icon = false;
			}
		}

	});

});