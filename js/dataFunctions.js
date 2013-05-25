function getMyData() {
	var query = 'SELECT movies, music, books FROM user WHERE uid = me()';

	// call the Facebook API using the fql
	FB.api('fql', {
		q : query
	}, function(data) {
		var obj = data.data;
		var movies_string = obj[0].movies;
		var music_string = obj[0].music;
		var books_string = obj[0].books;

		myMovies = movies_string.split(', ');
		myMusic = music_string.split(', ');
		myBooks = books_string.split(', ');
	});
};

function getFriendsData() {
	var query = 'SELECT movies, music, books FROM user WHERE uid in (SELECT uid2 FROM friend WHERE uid1=me())';
	FB.api('fql', {
		q : query
	}, function(data) {
		var obj = data.data;
		var movies_friend = "";
		var music_friend = "";
		var books_friend = "";

		Object.keys(obj).forEach(function(key) {
			// check if the user likes no movies
			if (obj[key].movies == "") {
				return;
			} else {
				// splits the returned string into single movies
				movies_friend = obj[key].movies.split(', ');

				// append the friends movies to the array that should contain all movies
				friendsMovies.push.apply(friendsMovies, movies_friend);
			};

			// check if the user likes no music
			if (obj[key].music == "") {
				return;
			} else {
				// splits the returned string into single artists
				music_friend = obj[key].music.split(', ');

				// append the friends movies to the array that should contain all artists
				friendsMusic.push.apply(friendsMusic, music_friend);
			};

			// check if the user likes no books
			if (obj[key].books == "") {
				return;
			} else {
				// splits the returned string into single books
				books_friend = obj[key].books.split(', ');

				// append the friends movies to the array that should contain all books
				friendsBooks.push.apply(friendsBooks, books_friend);
			}
		});
	});
};

function getMyCovers(type) {
	clearContentTable();

	if (type == "movies") {
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
	} else if (type == "music") {
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
	} else if (type == "books") {
		if (myBooks == "") {
			document.getElementById('content').innerHTML = no_content_table;
			return;
		};

		for (var i = 0; i < myBooks.length; i++) {
			if (i == myBooks.length - 1) {
				getBookCover(myBooks[i], 1, -1);
			} else {
				getBookCover(myBooks[i], 0, -1);
			}
		};
	}
	;
};

function getMyFriendsCovers(type) {
	clearContentTable();

	var all = new Array();
	var friendsData_with_counts = {};
	var friendsData_with_counts_sorted = [];

	if (type == "movies") {
		all = friendsMovies;
	} else if (type == "music") {
		all = friendsMusic;
	} else if (type == "books") {
		all = friendsBooks;
	}
	;

	// add a counter to the data
	for ( i = 0; i < all.length; i++) {
		var count = friendsData_with_counts[all[i]];
		if (count != null) {
			count++;
		} else {
			count = 1;
		}
		friendsData_with_counts[all[i]] = count;
	};

	// sorts the data after the count they have been liked
	for (var data in friendsData_with_counts) {
		friendsData_with_counts_sorted.push([data, friendsData_with_counts[data]]);
	};

	friendsData_with_counts_sorted.sort(function(a, b) {
		return b[1] - a[1];
	});

	// take only the 20 most liked
	var data_top20 = friendsData_with_counts_sorted.slice(0, 20);

	if (type == "movies") {
		for ( i = 0; i < data_top20.length; i++) {
			if (i == data_top20.length - 1) {
				getMovieCover(data_top20[i,i][0], 1, data_top20[i,i][1]);
			} else {
				getMovieCover(data_top20[i,i][0], 0, data_top20[i,i][1]);
			}
		};
	} else if (type == "music") {
		for ( i = 0; i < data_top20.length; i++) {
			if (i == data_top20.length - 1) {
				getMusic(data_top20[i,i][0], 1, data_top20[i,i][1]);
			} else {
				getMusic(data_top20[i,i][0], 0, data_top20[i,i][1]);
			}
		};
	} else if (type == "books") {
		for ( i = 0; i < data_top20.length; i++) {
			if (i == data_top20.length - 1) {
				getBookCover(data_top20[i,i][0], 1, data_top20[i,i][1]);
			} else {
				getBookCover(data_top20[i,i][0], 0, data_top20[i,i][1]);
			}
		};
	}
	;
};
