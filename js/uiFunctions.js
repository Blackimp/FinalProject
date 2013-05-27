var image = '';
var pic_index = 0;
var init_content_table = '<table><colgroup><col width="100"><col width="100"><col width="100"><col width="100"><col width="100"></colgroup><tr><td colspan="5" id="table_head"></td></tr>';
var no_content_table = '<div>No data available</div>';
var content_table = init_content_table;
var myMovies = new Array();
var myMusic = new Array();
var myBooks = new Array();
var friendsMovies = new Array();
var friendsMusic = new Array();
var friendsBooks = new Array();
var friendData = {
	names : [],
	movies : [],
	music : [],
	books : []
};

$(document).ready(function() {
	facebookLogin();
});

<<<<<<< HEAD
=======
var counter_string = '';

var myMovies = new Array();
var myMusic = new Array();
var myBooks = new Array();
var friendsMovies = new Array();
var friendsMusic = new Array();
var friendsBooks = new Array();
var friendData = {
	names : [],
	movies : [],
	music : [],
	books : []
};

$(document).ready(function() {
	facebookLogin();
});

>>>>>>> kevin
function output(title, image, last_item, like_count) {
	if (pic_index == 0) {
		content_table += "<tr>";
	} else if (pic_index % 5 == 0) {
		content_table += "</tr><tr>";
	}
	content_table += "<td>";

	if (like_count != -1) {
<<<<<<< HEAD
		content_table += "<div class='like_count'>" + like_count + " likes</div>";
=======
		content_table += "<div class='like_count'>"  + like_count + " " + counter_string + "</div>";
>>>>>>> kevin
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
<<<<<<< HEAD
}
=======
}

>>>>>>> kevin
