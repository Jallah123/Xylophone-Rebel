$(function() {
	$('ul#filmslist').endlessScroll({
		fireOnce: false,
		insertAfter: "ul#filmslist div:ui-last-child",
		data: function(i) {
			return '<li><a href="#detailed">unlimitedscroll</a><a class="ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-none"></a></li>'
		}
	});
});