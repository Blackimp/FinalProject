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
				getBookCover(books[i], 1);
			} else {
				getBookCover(books[i], 0);
			}
		};
	});
};

function getBookCover(book, last_item){
	// has to be implemented	
};
