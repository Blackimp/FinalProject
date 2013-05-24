function getMyBooks() {
	clearContentTable();

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
};

function getFriendBooks() {
	clearContentTable();

	var books_all = new Array();
	var book_counts = {};
	var book_counts_sorted = [];
	
	books_all = friendsBooks;

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
