jQuery(document).ready(function(){
	jQuery('#paintstory').on('click', function(event) {        
		jQuery('#paintdetail').toggle('show');
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

});