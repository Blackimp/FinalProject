var image = "";
var pic_index = 0;
var content_table = '<table>';

/*
$(document).ready(function() {

	$('#myMovies').click(function() {
		$("#myMoviesTable tr").empty();
		getMyMovies();
	});

	$('#friendsMovies').click(function() {
		$("#myMoviesTable tr").empty();
		getFriendMovies();
	});

	$('#recommended').click(function() {
		// to implement
	});

});
*/
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

function getMyMovies() {
      clearContentTable();

	var query = 'SELECT movies FROM user WHERE uid = me()';
	// call the Facebook API using the fql
	FB.api('fql', {
		q : query
	}, function(data) {
		var obj = data.data;
		var movies_string = obj[0].movies;

		var movies = movies_string.split(', ');

		for (var i = 0; i < movies.length; i++) {
			if (i == movies.length - 1) {
				getMovieCover(movies[i], 1);
			} else {
				getMovieCover(movies[i], 0);
			}
		};
	});
};

function getFriendMovies() {
      clearContentTable();
      
	var query = 'SELECT movies, name FROM user WHERE uid in (SELECT uid2 FROM friend WHERE uid1=me())';
	FB.api('fql', {
		q : query
	}, function(data) {
		var obj = data.data;
		var movies_string = "";
		var movies_friend = "";
		var movies_all = new Array();
		var movie_counts = {};
		var movie_counts_sorted = [];

		Object.keys(obj).forEach(function(key) {
			// check if the user likes no movies
			if (obj[key].movies == "") {
				return;
			} else {
				movies_string = obj[key].movies;

				// splits the returned string into single movies
				movies_friend = movies_string.split(', ');

				// append the friends movies to the array that should contain all movies
				movies_all.push.apply(movies_all, movies_friend);
			}
		});

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
				getMovieCover(movies_top20[i,i][0], 1);
			} else {
				getMovieCover(movies_top20[i,i][0], 0);
			}
		};
	});
};

function output(movie, image, last_item) {
	if (pic_index == 0) {
		content_table += "<tr>";
	} else if (pic_index % 5 == 0) {
		content_table += "</tr><tr>";
	}
	content_table += "<td><img src='" + image + "' alt='" + movie + "'></td>";
	if (last_item == 1) {
		content_table += "</tr></table>";
		document.getElementById('content').innerHTML = content_table;
	}
	pic_index++;

};

function getMovieCover(movie, last_item) {
	console.log(movie);
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
			output(movie, image, last_item);
		}
	});
};

function clearContentTable() {
      document.getElementById("content").innerHTML = '';
      content_table = '<table>';
}