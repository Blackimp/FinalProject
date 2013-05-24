function getMyArtists() {
	clearContentTable();

	if (myMusic == "") {
		document.getElementById('content').innerHTML = no_content_table;
		return;
	};

	for (var i = 0; i < myMusic.length; i++) {
		if (i == myMusic.length - 1) {
			getMusic(myMusic[i], 1, -1);
		} else {
			getMusic(myMusic[i], 0, -1);
		}
	};
};

function getFriendArtists() {
	clearContentTable();

	var artists_all = new Array();
	var artist_counts = {};
	var artist_counts_sorted = [];
	
	artists_all = friendsMusic;
	
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
			getMusic(artists_top20[i,i][0], 1, artists_top20[i,i][1]);
		} else {
			getMusic(artists_top20[i,i][0], 0, artists_top20[i,i][1]);
		}
	};
};

function getMusic(artist, last_item, like_count) {
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
		}
		;
	});
};