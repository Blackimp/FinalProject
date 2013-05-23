var image = '';
var pic_index = 0;
var init_content_table = '<table><colgroup><col width="100"><col width="100"><col width="100"><col width="100"><col width="100"></colgroup>';
var no_content_table = '<div>No data available</div>';
var content_table = init_content_table;

function output(title, image,  last_item, like_count) {
	if (pic_index == 0) {
		content_table += "<tr>";
	} else if (pic_index % 5 == 0) {
		content_table += "</tr><tr>";
	}
	content_table += "<td>";
	if(like_count != -1) {
	      content_table += "<div class='like_count'>"+like_count + " likes</div>";
	}
	content_table += "<img src='" + image + "' alt='" + title + "' onmouseover='showPic(\"" + title + "\",\"" + image + "\");'></td>";
	document.getElementById('content').innerHTML = content_table + "</tr></table>";
	if (last_item == 1) {
		content_table += "</tr></table>";
		document.getElementById('content').innerHTML = content_table;
	}
	pic_index++;
};

function clearContentTable() {
	pic_index = 0;
	document.getElementById("content").innerHTML = '';
	content_table = init_content_table;
}

function showPic(title,image) {
      var pic_string = '<div class="pic_title">'+title+'</div><img src='+image+'>';
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