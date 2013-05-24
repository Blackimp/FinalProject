var image = '';
var pic_index = 0;
var init_content_table = '<table><colgroup><col width="100"><col width="100"><col width="100"><col width="100"><col width="100"></colgroup>';
var no_content_table = '<div>No data available</div>';
var content_table = init_content_table;
var myMovies = new Array();
var myMusic = new Array();
var myBooks = new Array();
var friendsMovies = new Array();
var friendsMusic = new Array();
var friendsBooks = new Array();

$(document).ready(function() {
	facebookLogin();
});

function output(title, image, last_item, like_count) {
	if (pic_index == 0) {
		content_table += "<tr>";
	} else if (pic_index % 5 == 0) {
		content_table += "</tr><tr>";
	}
	content_table += "<td>";

	if (like_count != -1) {
		content_table += "<div class='like_count'>" + like_count + " likes</div>";
	}

	content_table += "<img src='" + image + "' alt='" + title + "' onmouseover='showPic(\"" + title + "\",\"" + image + "\");'></td>";
	document.getElementById('content').innerHTML = content_table + "</tr></table>";

	pic_index++;
};

function clearContentTable() {
	pic_index = 0;
	document.getElementById("content").innerHTML = '';
	content_table = init_content_table;
	document.getElementById("pic_screen").innerHTML = '';
}

function showPic(title, image) {
	var pic_string = '<div class="pic_title">' + title + '</div><img src=' + image + '>';
	document.getElementById('pic_screen').innerHTML = pic_string;
}

// setup the facebook application and load the facebook SDK
function facebookLogin() {
	// initialize
	window.fbAsyncInit = function() {
		FB.init({
			appId : '258484380963325', // App ID
			channelUrl : 'http://jneuberth.tk/FinalProject/channel.html', // Channel File
			status : true, // check login status
			cookie : true, // enable cookies to allow the server to access the session
			xfbml : true // parse XFBML
		});

		FB.Event.subscribe('auth.authResponseChange', function(response) {
			if (response.status === 'connected') {
				$('#facebookButton').hide();
				getMyData();
				getFriendsData();
			} else if (response.status === 'not_authorized') {
				FB.login({
					scope : 'user_likes,friends_likes,read_friendlists'
				});
			} else {
				FB.login({
					scope : 'user_likes,friends_likes,read_friendlists'
				});
			}
		});
	};

	// Load the SDK asynchronously
	( function(d) {
			var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
			if (d.getElementById(id)) {
				return;
			}
			js = d.createElement('script');
			js.id = id;
			js.async = true;
			js.src = "//connect.facebook.net/en_US/all.js";
			ref.parentNode.insertBefore(js, ref);
		}(document));
};

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