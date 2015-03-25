var eetNu = function(app){
	var self = this;
	var baseurl = "https://api.eet.nu/";
	var app = app;

	execRequest = function(collection, callback) {
		alert(collection);
		$.ajax({
			url: collection,
			method: 'GET',
			timeout: 5000
		}).done(function(data) {
			callback(data);
		}).fail(function () {
			alert('Request failed');
		});
	};
	self.getLocalVenues = function(){
		var location = window.localStorage.getItem("location");
		var location = JSON.parse(window.localStorage.getItem("location"));
		if(location){
			execRequest(baseurl + "venues?geolocation=" + location.coords.latitude + "," + location.coords.longitude + "&per_page=10", venuesCallback);
		} else {
			alert("no location");
		}
	};
	
	function venuesCallback(data) {
		app.addNewVenues(data.results);
		var interval = setInterval(function(){
			$.mobile.loading('hide');
			clearInterval(interval);
		},1);   
	};
	
	self.getReviewsByVenueId = function(venue) {
		execRequest(venue.resources.reviews, reviewCallback);
	};
	function reviewCallback(data) {
		app.fillDetail(data);
	};
	return self;
};