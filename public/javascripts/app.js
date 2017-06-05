$(document).ready(function(){
	var height = $(window).height()-45;
	$('.aside').height(height);
	$('.main-content').height(height);
});
$(window).resize(function(){
	var height = $(window).height()-45;
	$('.aside').height(height);
	$('.main-content').height(height);
})
//左侧菜单折叠
$('.aside ul.nav li a').not($('ul.submenu li a')).unbind('click').click(function(){
	if( $(this).parent().hasClass('open') ){
		$(this).parent().removeClass('open').find('ul.submenu').slideUp();
	}else{
		$(this).parent().addClass('open').find('ul.submenu').slideToggle();
	}
});
//左侧菜单最小化
$('.mini').click(function(){
	if( $('.aside').hasClass('mini-aside') ){
		$('.aside').removeClass('mini-aside');
	}else{
		$('.aside').addClass('mini-aside');
	}
});
//文件上传组件
$('.choose-btn').click(function(){
	$(this).parents('.input-group').find('.file-input').click();
});
$('.file-input').change(function(){
	$(this).parent().find('.file-cover').val( $(this).val() );
})
//换肤
$('#change-theme').click(function(){
	console.log('ddd');
	if( $('body').hasClass('dark') ){
		$('body').removeClass('dark');
	}else{
		$('body').addClass('dark');
	}
})
