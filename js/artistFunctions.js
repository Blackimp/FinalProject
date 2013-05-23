function getMyArtists() {
	clearContentTable();

	var query = 'SELECT music FROM user WHERE uid = me()';
	// call the Facebook API using the fql
	FB.api('fql', {
		q : query
	}, function(data) {
		var obj = data.data;
		var artists_string = obj[0].music;

		var artists = artists_string.split(', ');

		for (var i = 0; i < artists.length; i++) {
			if (i == artists.length - 1) {
				getArtist(artists[i], 1);
			} else {
				getArtist(artists[i], 0);
			}
		};
	});
};

function getArtist(artist, last_item) {
	var url = "http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=" + artist + "&api_key=b15fbe5f05f68e2b62bbbe3f4242c303&format=json";

	$.getJSON(url, function(data) {
		var obj = data.results;

		// here is a problem with the JSON response, because a # is in the element tag before "text". This is why we have to work with a temp variable.
		var tmp = obj.artistmatches.artist[0].image[2];
		var image = tmp['#text'];

		output(artist, image, last_item);
	});
};
