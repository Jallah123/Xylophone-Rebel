var eetNu = {
	baseurl:"https://api.eet.nu/",

	execRequest: function(collection, callback) {
		alert(collection);
		$.ajax({
			url: this.baseurl + collection,
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
			eetNu.execRequest("venues?geolocation=" + location.coords.latitude + "," + location.coords.longitude + "&per_page=10", eetNu.venuesCallback);
		} else {
			alert("no location");
		}
	},
	venuesCallback: function(data) {
		alert("start");
		alert(data.results[0].id);
		alert("eind");
	}
};