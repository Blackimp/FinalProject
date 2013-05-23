function getMyBooks() {
	clearContentTable();

	var query = 'SELECT books FROM user WHERE uid = me()';
	// call the Facebook API using the fql
	FB.api('fql', {
		q : query
	}, function(data) {
		var obj = data.data;
		var books_string = obj[0].books;

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

function getFriendBooks(){
	// has to be implemented
};

function getBookCover(book, last_item, like_count) {
	var url = "https://www.googleapis.com/books/v1/volumes?q=name:" + book + "&key=AIzaSyBnae4sYFxP0v1Mb3jTM517j5i0nyloGbA";

	$.getJSON(url, function(data) {
		var obj = data;
		if (obj.totalitems == 0){
			return;
		};
		var image = obj.items[0].volumeInfo.imageLinks.thumbnail;
		console.log(image);
		output(book, image, last_item, like_count);
	});
};
