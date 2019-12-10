$(document).on("pagecreate", "#highScore", function(event) {

	if (localStorage.length > 0) {
		var scores = [];
		for (var i = 0; i < localStorage.length; i++) {
			scores.push(JSON.parse(localStorage.getItem('score_'+i)));
		}
		scores.sort(function(a, b){return b.score-a.score});
		var html = '';
		console.log(scores);
		for (var i = 0; i < scores.length; i++) {
			html += '<li>' + scores[i].score + '</li>';
		}
		$('#highScoreList').append(html).listview('refresh');

	} else {
		$('#noScore').append('<p>No highscores</p>');
	}

});