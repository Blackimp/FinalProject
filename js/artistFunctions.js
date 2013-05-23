function getMyArtists() {
	getArtist("Jan Delay");
};

function getArtist(artist) {
	var url = "http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=" + artist + "&api_key=b15fbe5f05f68e2b62bbbe3f4242c303&format=json";

	$.getJSON(url, function(data) {
		var obj = data.results;
		// here is a problem with the JSON response, because a # is in the element tag before "text"
		var image = obj.artistmatches.artist[0].image[2];

		console.log(JSON.stringify(image));
	});
};
