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
			$('#myMoviesTable').append("<tr><td>Cover</td><td>" + movies[i] + "</td></tr>");
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