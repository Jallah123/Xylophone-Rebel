var eetNu = function(app){
	var self = this;
	var baseurl = "https://api.eet.nu/";
	var app = app;

	self.execRequest = function(collection, callback) {
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
		var location = JSON.parse(window.localStorage.getItem("location"));
		if(location){
			app.getMaxDistance(function(transaction, results){
				self.execRequest(baseurl + "venues?geolocation=" + location.coords.latitude + "," + location.coords.longitude + "&per_page=20&max_distance=" + results.rows.item(0).max_distance, venuesCallback);
				});
		}else {
			alert("no location");
		}
	};
	
	function venuesCallback(data) {
		app.setNextPage(data.pagination.next_page);
		app.addNewVenues(data.results);
		var interval = setInterval(function(){
			$.mobile.loading('hide');
			clearInterval(interval);
		},1);   
	};
	
	self.getReviewsByVenueId = function(venue) {
		self.execRequest(venue.resources.reviews, reviewCallback);
	};
	function reviewCallback(data) {
		app.fillDetail(data);
	};
	return self;
};