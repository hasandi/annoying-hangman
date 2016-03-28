if (localStorage.played === undefined) {
	localStorage.setItem("totalWin", 0);
	localStorage.setItem("totalLose", 0);
	localStorage.setItem("logs", 0);
}

$(document).ready(function() {
	var keyword;
	var guessedLetter = 0,
		falseAttempt = 0,
		score = 0;
	var rightAttempt = false; // Variabel tanda telah menebak dengan benar

	start();
	
	function start() {
		$(".keyboardButton").prop('disabled', false);	// Meng-enable ulang button keyboard
		
		$.getJSON("tips.json", function(result) {
			var randomNumber = generateRandomNumber(result.length);
			$("#tips").text(result[randomNumber]);
		});
		
		$.ajax({	// Mengambil data dari listkata.txt dengan AJAX jQuery
			url: "listkata.txt",
			success: function(result) {
				arrayOfWords = result.split("\n"); // Membuat array yang berisi kata-kata dari listkata.txt
				for (i = 0; i < arrayOfWords.length; i++)
					sessionStorage.setItem(i, arrayOfWords[i]);	// Menyimpan kata-kata di session storage dengan key index
				var randomNumber = generateRandomNumber(arrayOfWords.length);	// Men-generate random number dan kemudian mengambil kata di session storage
				keyword = sessionStorage.getItem(randomNumber);
				for (i = 0; i < keyword.length - 1; i++) {
					$("#keyword").append("<div class='letter' id='" + i + "'>_</div>");	// Membuat field keyword
				}
			}
		});
		
		$("#loseCount").text(localStorage.getItem("totalLose"));
		$("#winCount").text(localStorage.getItem("totalWin"));
		for (i = 1; i <= Number(localStorage.logs); i++) {
			$("#gameLog").append('<div>' + i + '</div>');
			$("#scoreLog").append('<div>' + localStorage.getItem(i) + '</div>');
		}
		if (localStorage.played == 'true')
			$(".strip").remove();
	}
	
	/*
		Fungsi untuk menghasilkan angka acak dari suatu ukuran array.
	*/
	function generateRandomNumber(size) {
		return Math.ceil(Math.random() * size) - 1;
	}
	
	/*
		Fungsi untuk menebak huruf.
	*/
	function guess(letter) {
		if ($("#" + letter).attr('disabled') == 'disabled') {	// Memeriksa apakah button sudah disabled
			return null;
		} else {
			for (var i = 0; i < keyword.length - 1; i++) {
				if (keyword.charAt(i) == letter) {	// Mencocokkan tiap karakter dengan input hurufʉ				
					$("#" + i).html(letter);
					rightAttempt = true;	// Tebakan benar
					guessedLetter += 1;	// Tambahkan jumlah kata yang telah benar ditebak
				}
			}
			
			if (!rightAttempt) { // Jika salah tebak
				falseAttempt += 1;
				score -= 10;
				$("#score").text(score);
				$("img").attr('src', "assets/" + falseAttempt + ".jpg");
			} else { // Jika benar tebak
				score += 20;
				$("#score").text(score);
			}
			rightAttempt = false;	// Reset percobaan tebak
			$("#" + letter).attr('disabled', 'disabled');	// Disable huruf yang telah ditebak
		}
		checkWinOrLose();
	}

	/*
		Fungsi untuk memeriksa kondisi menang atau kalah. Kemudian menampilkan animasi.
	*/
	function checkWinOrLose() {
		if (falseAttempt == 7) {
			finishGameResult("Hahahaha! You lose! You better study first, buddy!", "red", false);
			setTotal("totalLose", "#loseCount");
		}
		if (guessedLetter == keyword.length - 1) {
			finishGameResult("You win? I don't care! Hahaha!", "green", true);
			setTotal("totalWin", "#winCount");
		}
	}

	/*
		Fungsi untuk menampilkan animasi hasil permainan: menang atau kalah.
	*/
	function finishGameResult(message, color, win) {
		$("#image").fadeOut('slow', function() {
			$("#image").html('<img id="resultImg" src="assets/lose.png">');
			$("#resultImg").css('width', '50%');
			$("#image").append('<div>' + message + '</div>');
			if (!win)
				$("#image").append('<div>The answer is: "' + keyword.substring(0, keyword.length - 1) + '". Poor you.</div>');
			$("#respondButton").slideDown('slow');
			$("#image").css({
				'color': color,
				'font-weight': 'bold',
				'height': '100%'
			});
			$("#image").css('display', 'none');
		});
		$("#image").fadeIn('slow');
		$(".keyboardButton").attr('disabled', 'disabled');
		localStorage.setItem("logs", Number(localStorage.logs) + 1);
		localStorage.setItem(localStorage.logs, score);
		$("#gameLog").append('<div>' + localStorage.logs + '</div>');
		$("#scoreLog").append('<div>' + score + '</div>');
		$(".strip").remove();
		localStorage.setItem('played', 'true');
	}

	/*
		Fungsi untuk men-set total menang atau total kalah.
	*/
	function setTotal(target, outputField) {
		localStorage.setItem(target, Number(localStorage.getItem(target)) + 1);
		$(outputField).text(localStorage.getItem(target));
	}

	/*
		Fungsi untuk me-reset elemen
	*/
	function clearElements() {
		$("#keyword").html('');
		$("#score").text(0);
		$("#gameLog").html('<div class="rowElement">Game</div><div class="strip" class="rowElement">-</div>');
		$("#scoreLog").html('<div class="rowElement">Score</div><div class="strip" class="rowElement">-</div>');
		$("#image").html('<img src="assets/0.jpg">');
		$("#respondButton").css('display', 'none');
		guessedLetter = 0, falseAttempt = 0, score = 0;
		rightAttempt = false;
	}

	/*
		Fungsi untuk mengulangi game dari awal.
	*/
	function restart() {
		clearElements();
		start();
	}

	$(".keyboardButton").click(function() {
		guess($(this).val());
	});
	
	// Keyboard handler
	$(document).keydown(function(event) {
		if (event.which >= 65 && event.which <= 90) {
			guess(String.fromCharCode(event.which + 32));
		}
	});
	
	// Reset semua value
	$("#resetGame").click(function() {
		// Reset local storage
		localStorage.clear();
		localStorage.logs = 0;
		localStorage.totalWin = 0;
		localStorage.totalLose = 0;
		$("#winCount").html(0);
		$("#loseCount").html(0);
		restart();
	});

	$("#playAgain").click(function() {
		restart();
	});
});