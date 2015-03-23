var eetNu = {
	baseurl:"https://api.eet.nu/",

	execRequest: function(collection) {
		$.ajax({
			url: this.baseurl + collection,
			method: 'GET',
			timeout: 5000
		}).done(function(data) {
			return JSON.parse(data);
		}).fail(function () {
			alert('Request failed');
		})
	},
	getLocalVenues: function(){
		var location = window.localStorage.getItem("location");
		var result = this.execRequest("venues?lat=" + location.lat + "?long" + location.long);
	}
};