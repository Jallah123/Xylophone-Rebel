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
		var location = JSON.parse(window.localStorage.getItem("location"));
		if(location){
			alert(123);
			eetNu.execRequest("?geolocation=:" + location.coords.latitude + "," + location.coords.longitude, eetNu.venuesCallback);
		} else {
			alert("no location");
		}
		//wait for window.localStorage.setItem("location", JSON.stringify(position)); do something with item
	},
	venuesCallback: function(data) {
		alert(data);
	}
};