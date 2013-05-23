function getMyBooks() {
	clearContentTable();

	var query = 'SELECT books FROM user WHERE uid = me()';
	// call the Facebook API using the fql
	FB.api('fql', {
		q : query
	}, function(data) {
		var obj = data.data;
		var books_string = obj[0].books;
            if(books_string == "") {
                  document.getElementById('content').innerHTML = no_content_table;
                  return;
            }
                        
		var books = books_string.split(', ');
		for (var i = 0; i < books.length; i++) {
			if (i == books.length - 1) {
				getBookCover(books[i], 1, -1);
			} else {
				getBookCover(books[i], 0, -1);
			}
		};
	});
};

function getFriendBooks() {
	clearContentTable();

	var query = 'SELECT books FROM user WHERE uid in (SELECT uid2 FROM friend WHERE uid1=me())';
	FB.api('fql', {
		q : query
	}, function(data) {
		var obj = data.data;
		var books_string = "";
		var books_friend = "";
		var books_all = new Array();
		var book_counts = {};
		var book_counts_sorted = [];

		Object.keys(obj).forEach(function(key) {
			// check if the user likes no movies
			if (obj[key].books == "") {
				return;
			} else {
				books_string = obj[key].books;

				// splits the returned string into single movies
				books_friend = books_string.split(', ');

				// append the friends movies to the array that should contain all movies
				books_all.push.apply(books_all, books_friend);
			}
		});

		// add a counter to the movies
		for ( i = 0; i < books_all.length; i++) {
			var count = book_counts[books_all[i]];
			if (count != null) {
				count++;
			} else {
				count = 1;
			}
			book_counts[books_all[i]] = count;
		};

		// sorts the movies after the count they have been liked
		for (var book in book_counts) {
			book_counts_sorted.push([book, book_counts[book]]);
		};

		book_counts_sorted.sort(function(a, b) {
			return b[1] - a[1];
		});

		// take only the 20 most liked movies
		var books_top20 = book_counts_sorted.slice(0, 20);

		for ( i = 0; i < books_top20.length; i++) {
			if (i == books_top20.length - 1) {
				getBookCover(books_top20[i,i][0], 1, books_top20[i,i][1]);
			} else {
				getBookCover(books_top20[i,i][0], 0, books_top20[i,i][1]);
			}
		};
	});
};

function getBookCover(book, last_item, like_count) {
	var url = "https://www.googleapis.com/books/v1/volumes?q=name:" + book + "&key=AIzaSyBnae4sYFxP0v1Mb3jTM517j5i0nyloGbA";

	$.getJSON(url, function(data) {
		var obj = data;
		if (obj.totalitems == 0) {
			return;
		};
		if (obj.items[0].volumeInfo.imageLinks == undefined) {
			return;
		} else {
			var image = obj.items[0].volumeInfo.imageLinks.thumbnail;
			console.log(image);
			output(book, image, last_item, like_count);
		}
	});
};
