var artists = [
	'Metallica',
	'Cher',
	'One Direction',
	'Psy'
];

// Returns a cloned, shuffled list of artists
function getShuffledList() {
	var myArray = new Array();
	$.each(artists, function(i, element) {
		myArray.push(element);
	});
	var i = myArray.length;
	if ( i == 0 ) return false;
	while ( --i ) {
		var j = Math.floor( Math.random() * ( i + 1 ) );
		var tempi = myArray[i];
		var tempj = myArray[j];
		myArray[i] = tempj;
		myArray[j] = tempi;
	}
	return myArray;
}

function getFansForArtist(artist, callback) {
	$.ajax({
		url: "http://ws.audioscrobbler.com/2.0/",
		data: {
			"method": "artist.gettopfans",
			"artist": artist,
			"api_key": "271b20f03af75122c82e09f3b4399db3",
			"format": "json"
		},
		success: function(res) {
			callback(res.topfans.user);
		},
		dataType: 'json'
	});
}

var thisRoundWinner;

$(function() {

	function startRound() {
		var shuffledList = getShuffledList();
		console.log(shuffledList);
		shuffledList = shuffledList.splice(0, 4);
		console.log(shuffledList);
		var winnerId = Math.floor(Math.random() * 4);
		thisRoundWinner = shuffledList[winnerId];


		// Get pictures
		$('.faces').empty();
		getFansForArtist(thisRoundWinner, function(fans) {
			console.log(fans);

			$.each(fans, function(i, fan) {
				var url = fan.image[1]['#text'];
				url = url.replace(/\/64\//m, "\/64s\/");
				if (url) {
					var $image = $('<img alt="dontcare">');
					$image.attr('src', url);
					$('.faces').append($image);
				}
			});
		});

		// Display choices
		$('.choises').empty();
		$.each(shuffledList, function(i, artist) {

			var $choice = $('<li><a href="#">'+artist+'</a></li>');
			$('a', $choice).click(function() {
				if (artist == thisRoundWinner) {
					alert('yes');
				}
				else
				{
					alert('no');
				}
			});
			$('.choices').append($choice);
		});

	}

	startRound();
});