function getMovieCover(movie, last_item, like_count) {
	var api_key = "bcc2dc80864852143b71c43ccdc9df30";
	var url = "http://api.themoviedb.org/3/search/movie?query=" + movie + "&api_key=" + api_key;
	$.getJSON(url, function(data) {
		var obj = data;
		if (obj.results[0] == undefined) {
			return;
		} else if (obj.results[0].poster_path == null) {
			return;
		} else {
			image = "http://cf2.imgobject.com/t/p/w500" + obj.results[0].poster_path;
		}
		output(movie, image, last_item, like_count);
	});
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

function getBookCover(book, last_item, like_count) {
	var url = "https://www.googleapis.com/books/v1/volumes?q=" + book + "&key=AIzaSyBnae4sYFxP0v1Mb3jTM517j5i0nyloGbA";

	$.getJSON(url, function(data) {
		var obj = data;
		if (obj.totalitems == 0) {
			return;
		};
		if (obj.items[0].volumeInfo.imageLinks == undefined) {
			return;
		} else {
			var image = obj.items[0].volumeInfo.imageLinks.thumbnail;
			output(book, image, last_item, like_count);
		}
	});
};