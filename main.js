var artists = [
	'Metallica',
	'Cher',
	'One Direction',
	'Psy',
	'Adele',
	'Mozart',
	'Backstreet Boys',
	'Pink Floyd',
	'Coldplay',
	'Journey',
	'REM',
	'Queen',
	'Abba',
	'Skrillex',
	'Red Hot Chili Peppers',
	'Pussy Riots',
	'Fury In The Slaughterhouse',
	'Rage Against the Machine',
	'浜崎あゆみ',
	'Florence + the Machine',
	'Lana Del Rey'
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

function updateText() {
	$('#points').text(points);
}

function notify(text, type) {
	$.pnotify({
        title: "Facematch",
        text: text,
        type: type || 'info',
        icon: "",
        delay: 2000,
        before_open: function(pnotify) {
            // Position this notice in the center of the screen.
            /*pnotify.css({
                "top": ($(window).height() / 2) - (pnotify.height() / 2),
                "left": ($(window).width() / 2) - (pnotify.width() / 2)
            });*/
            
        }
    });
}

var thisRoundWinner;
var points = 0;
var rounds = 0;

$(function() {

	function startRound() {
		
		if (rounds == 5) {
			notify('You\'re finished! You got '+points+'.');
			$('section').hide();
			$('.gameover').show();

			var tweeturl = 'http://twitter.com/?status=I+just+scored+'+points+'+points+in+%23facematch.+' + encodeURIComponent('http://marekventur.github.com/facematch/');
			$('#tweet').attr('href', tweeturl);
			return;
		}

		rounds++;


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
		$('.choices').empty();
		$.each(shuffledList, function(i, artist) {

			var $choice = $('<li><a href="#">'+artist+'</a></li>');
			$('a', $choice).click(function() {
				if (artist == thisRoundWinner) {
					points += 5;
					notify('Fan-tastic! That\'s five points for you!');
					tries = 2;
					startRound();
				}
				else
				{
					points -= 1;
					$choice.css('text-decoration', 'line-through');
					
					
					notify('Ups! Try again. -1 point.');
					
				}

				updateText();
			});
			$('.choices').append($choice);

			updateText();
		});

		updateText();

	}

	startRound();
});