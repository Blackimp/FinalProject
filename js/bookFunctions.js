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
		console.log(books);
		for (var i = 0; i < books.length; i++) {
			if (i == books.length - 1) {
				getBookCover(books[i], 1);
			} else {
				getBookCover(books[i], 0);
			}
		};
	});
};

function getFriendBooks(){
	// has to be implemented
};

function getBookCover(book, last_item) {
	var url = "https://www.googleapis.com/books/v1/volumes?q=name:" + book;

	$.getJSON(url, function(data) {
		var obj = data;
		if (obj.totalitems == 0){
			return;
		};
		var image = obj.items[0].volumeinfo.imageLinks.thumbnail;
		console.log(image);
		output(book, image, last_item);
	});
};
