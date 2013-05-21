var image = "";
var pic_index = 0;
var myMovieTable_string = '';

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
				getMyMovies();
				getFriendMovies();
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
	var query = 'SELECT movies FROM user WHERE uid = me()';
	// call the Facebook API using the fql
	FB.api('fql', {
		q : query
	}, function(data) {
		var obj = data.data;
		var movies_string = obj[0].movies;

		var movies = movies_string.split(', ');

		for (var i = 0; i < movies.length; i++) {
		      if(i == movies.length-1) {
				getMovieCover(movies[i],1);
		      } else {
		      	getMovieCover(movies[i],0);
		      }
		};
	});
};

function getFriendMovies() {
	var query = 'SELECT movies, name FROM user WHERE uid in (SELECT uid2 FROM friend WHERE uid1=me())';
	FB.api('fql', {
		q : query
	}, function(data) {
		var obj = data.data;
		var movies_string = "";
		var movies = "";

		Object.keys(obj).forEach(function(key) {
			// check if the user has set no hometown in his profile
			if (obj[key].movies == "") {
				return;
			} else {
				movies_string = obj[key].movies;
				movies = movies_string.split(', ');

				var text = "";
				for (var i = 0; i < movies.length; i++) {
					text += movies[i] + "\n";
				}
			}
		});
	});
};


function output(movie, image, last_item) {
      if(pic_index == 0) {
            myMovieTable_string += "<tr>";
      } else if(pic_index % 5 == 0) {
            myMovieTable_string += "</tr><tr>";
      }
	myMovieTable_string += "<td><img src='" + image + "' alt='" + movie + "'></td>";
	if(last_item == 1) {
	      myMovieTable_string += "</tr>";
	      $('#myMoviesTable').append(myMovieTable_string);
	}
	pic_index++;
	
};

function getMovieCover(movie, last_item) {
	var api_key = "bcc2dc80864852143b71c43ccdc9df30";
	var url = "http://api.themoviedb.org/3/search/movie?query=" + movie + "&api_key=" + api_key;
	$.getJSON(url, function(data) {
		var obj = data;
		if (obj.results[0] == undefined) {
			return;
		} else if (obj.results[0].poster_path == null){
			return;
		} else {
			image = "http://cf2.imgobject.com/t/p/w500" + obj.results[0].poster_path;
			output(movie, image, last_item);
		}
	});
};
