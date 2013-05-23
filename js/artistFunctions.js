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
				getArtist(artists[i], 1, -1);
			} else {
				getArtist(artists[i], 0, -1);
			}
		};
	});
};

function getFriendArtists() {
	clearContentTable();

	var query = 'SELECT music FROM user WHERE uid in (SELECT uid2 FROM friend WHERE uid1=me())';
	FB.api('fql', {
		q : query
	}, function(data) {
		var obj = data.data;
		var artists_string = "";
		var artists_friend = "";
		var artists_all = new Array();
		var artist_counts = {};
		var artist_counts_sorted = [];

		Object.keys(obj).forEach(function(key) {
			// check if the user likes no movies
			if (obj[key].music == "") {
				return;
			} else {
				artists_string = obj[key].music;

				// splits the returned string into single movies
				artists_friend = artists_string.split(', ');

				// append the friends movies to the array that should contain all movies
				artists_all.push.apply(artists_all, artists_friend);
			}
		});

		// add a counter to the movies
		for ( i = 0; i < artists_all.length; i++) {
			var count = artist_counts[artists_all[i]];
			if (count != null) {
				count++;
			} else {
				count = 1;
			}
			artist_counts[artists_all[i]] = count;
		};

		// sorts the movies after the count they have been liked
		for (var artist in artist_counts) {
			artist_counts_sorted.push([artist, artist_counts[artist]]);
		};

		artist_counts_sorted.sort(function(a, b) {
			return b[1] - a[1];
		});
		// take only the 20 most liked movies
		var artists_top20 = artist_counts_sorted.slice(0, 20);

		for ( i = 0; i < artists_top20.length; i++) {
			if (i == artists_top20.length - 1) {
				getArtist(artists_top20[i,i][0], 1, artists_top20[i,i][1]);
			} else {
				getArtist(artists_top20[i,i][0], 0, artists_top20[i,i][1]);
			}
		};
	});
};

function getArtist(artist, last_item, like_count) {
	var url = "http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=" + artist + "&api_key=b15fbe5f05f68e2b62bbbe3f4242c303&format=json";

	$.getJSON(url, function(data) {
		var obj = data.results;

		if (obj.artistmatches.artist == undefined) {
			return;
		} else if (obj.artistmatches.artist[0] == undefined) {
			return;
		} else {
			// here is a problem with the JSON response, because a # is in the element tag before "text". This is why we have to work with a temp variable.
			var tmp = obj.artistmatches.artist[0].image[3];
			var image = tmp['#text'];
			output(artist, image, last_item, like_count);
		};
	});
};
