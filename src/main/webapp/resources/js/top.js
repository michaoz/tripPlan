$(function(){
	$('.your-trip-plans-div p').hover(
		function(){
			$(this).css('color', '#DC143C');
		},
		function(){
			$(this).css('color', '#000');
		}
	);
	$('.your-trip-plans-div p').click(
		function(){
			$(this).toggleClass('active');
			$(this).parent().next().children('nav').slideToggle();
		}
	);
});
