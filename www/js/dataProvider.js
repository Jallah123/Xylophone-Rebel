var eetNu = {
	baseurl:"https://api.eet.nu/",

	execRequest: function(collection, callback) {
		alert(collection);
		$.ajax({
			url: collection,
			method: 'GET',
			timeout: 5000
		}).done(function(data) {
			callback(data);
		}).fail(function () {
			alert('Request failed');
		})
	},
	getLocalVenues: function(){
		var location = window.localStorage.getItem("location");
		var location = JSON.parse(window.localStorage.getItem("location"));
		if(location){
			eetNu.execRequest(this.baseurl + "venues?geolocation=" + location.coords.latitude + "," + location.coords.longitude + "&per_page=10", eetNu.venuesCallback);
		} else {
			alert("no location");
		}
	},
	venuesCallback: function(data) {
		app.addNewVenues(data.results);
	    var interval = setInterval(function(){
        	$.mobile.loading('hide');
        	clearInterval(interval);
    	},1);   
	},
	getReviewsByVenueId: function(venue) {
		eetNu.execRequest(venue.resources.reviews, eetNu.reviewCallback);
	},
	reviewCallback: function(data) {
		app.fillDetail(data);
	}
};