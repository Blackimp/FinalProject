function getMyMovies() {
	clearContentTable();

	if (myMovies == "") {
		document.getElementById('content').innerHTML = no_content_table;
		return;
	};

	for (var i = 0; i < myMovies.length; i++) {
		if (i == myMovies.length - 1) {
			getMovieCover(myMovies[i], 1, -1);
		} else {
			getMovieCover(myMovies[i], 0, -1);
		}
	};
};

function getFriendMovies() {
	clearContentTable();

	var movies_all = new Array();
	var movie_counts = {};
	var movie_counts_sorted = [];

	movies_all = friendsMovies;

	// add a counter to the movies
	for ( i = 0; i < movies_all.length; i++) {
		var count = movie_counts[movies_all[i]];
		if (count != null) {
			count++;
		} else {
			count = 1;
		}
		movie_counts[movies_all[i]] = count;
	};

	// sorts the movies after the count they have been liked
	for (var movie in movie_counts) {
		movie_counts_sorted.push([movie, movie_counts[movie]]);
	};

	movie_counts_sorted.sort(function(a, b) {
		return b[1] - a[1];
	});

	// take only the 20 most liked movies
	var movies_top20 = movie_counts_sorted.slice(0, 20);

	for ( i = 0; i < movies_top20.length; i++) {
		if (i == movies_top20.length - 1) {
			getMovieCover(movies_top20[i,i][0], 1, movies_top20[i,i][1]);
		} else {
			getMovieCover(movies_top20[i,i][0], 0, movies_top20[i,i][1]);
		}
	};
};

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
			output(movie, image, last_item, like_count);
		}
	});
};
