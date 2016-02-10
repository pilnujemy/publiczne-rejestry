
(function($) {
	var navbar = $('.navbar');
	var sectionIntroduction = $('.section--introduction');
	if(sectionIntroduction == 0){
		return;
	}
	function checkScroll(){
		if(($(window).scrollTop() - sectionIntroduction.outerHeight() + navbar.outerHeight()) > 0) {
			navbar.removeClass('navbar-opaque');
		}else{
			navbar.addClass('navbar-opaque');
		}
	} 

	$(window).scroll(checkScroll);
	checkScroll();
}(jQuery));
