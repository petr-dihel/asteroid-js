$(document).on("pagecreate", "#game", function(event) {

	var
		htmlCanvas = document.getElementById('canvas'),
		context = htmlCanvas.getContext('2d');

	initialize();
	function initialize() {
		window.addEventListener('resize', resizeCanvas, false);
		resizeCanvas();
	}

	function restartGame() {
			endOfGame = false;
			score = 0;
			player.shootParticles = [];
			player.particles = [];
			player.positionVector = new Vector(htmlCanvas.width/2,htmlCanvas.height/2);
			player.speedVector = new SpeedVector(0, 0);
			asteroids = [];
	}

	function gameOver() {
		context.font = "30px Arial";
		context.fillStyle = "red";
		context.fillText("GameOver", (htmlCanvas.width/2)-100, (htmlCanvas.height/2)-100);
		context.fillText("Press R to Start New Game", (htmlCanvas.width/2)-150, (htmlCanvas.height/2));
		var index = localStorage.length;;
		var scoreToStorage = {
			index : index,
			score : score
		};
		localStorage['score_' + index] = JSON.stringify(scoreToStorage);
	}

	function redraw() {
		context.strokeStyle = 'blue';
		context.lineWidth = '5';
		context.strokeRect(0, 0, window.innerWidth, window.innerHeight);
		context.fillStyle = "black";
		context.fillRect(0, 0, window.innerWidth, window.innerHeight);
	}

	function resizeCanvas() {
		htmlCanvas.width = window.innerWidth;
		htmlCanvas.height = window.innerHeight;
		redraw();
	}

	var asteroids = [];
	var lastGeneratedAsteroid = 0;
	var lastThrustEffect = 1000;

	var player = new PlayerShip(htmlCanvas.width/2,htmlCanvas.height/2);
	var asteroidsParticles = [];

	window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
	window.addEventListener('keydown', function(event) { Key.onKeydown(event, endOfGame); }, false);

	function showFPS(context) {
		context.font = "30px Arial";
		context.fillStyle = "red";
		context.fillText("FPS: " +fps, 30, 30);
	}

	function showScore(context) {
		context.font = "30px Arial";
		context.fillStyle = "red";
		context.fillText("Score: " + score, htmlCanvas.width-200, 30);
	}

	function calcFps() {
		fps = loopsPerSecond;
	}
	
	function keyUpdate() {
		if (Key.isDown(KEY_UP)) {
			player.addSpeed();
			if (lastThrustEffect > 30) {
				var thrustEffect = document.getElementById("thrustEffect");
				thrustEffect.currentTime = 0;
				lastThrustEffect = 0;
				//thrustEffect.play();
			}
		}
		if (Key.isDown(KEY_DOWN)) player.backThrusters();
		if (Key.isDown(KEY_LEFT)) player.leftRotation();
		if (Key.isDown(KEY_RIGHT)) player.rightRotation();
		if (Key.isDown(KEY_SPACE)) player.shot();
		if (endOfGame && Key.isDown(Key.R_KEY)) restartGame();
	}

	function checkAsteroids() {
		var shipLines = player.getLines();
		for (var i = 0; i < asteroids.length; i++) {
			if (player.shootParticles.length > 0) {
			for (var j = 0; j < player.shootParticles.length; j++) {
				if (asteroids[i].getBox().isColliding(player.shootParticles[j].getBox())) {
					var asteroidLines = asteroids[i].getLines();
					var particleLines = player.shootParticles[j].getBox().getLines();
					for (var k = 0; k < 4; k++) {
						for (var l = 0; l < asteroidLines.length; l++) {
							if (particleLines[k].intersect(asteroidLines[l], context)) {
								var newAsteroids = [];
								newAsteroids = asteroids[i].explode();
								var tmpAsteroidsParticles = asteroids[i].getExplodeParticles();
								for (var tmpAsteroidsParticlesI = 0; tmpAsteroidsParticlesI <= 20; tmpAsteroidsParticlesI++) {
									asteroidsParticles.push(tmpAsteroidsParticles[tmpAsteroidsParticlesI]);
								}
								score++;
								asteroids.splice(i, 1);
								if (newAsteroids.length) {
									asteroids.push(newAsteroids[0]);
									asteroids.push(newAsteroids[1]);
								}
								player.shootParticles.splice(j, 1);
								asteroidLines = null;
								particleLines = null;
								k = 5;
								return false;
							}
						}
					}
				}
			}
			}
			if (asteroids[i].getBox().isColliding(player.getBox())) {
				var asteroidLines = asteroids[i].getLines();
				for (var j = 0; j < 3; j++) {
					for (var k = 0; k < asteroidLines.length; k++) {
						if (shipLines[j].intersect(asteroidLines[k], context)) {
							endOfGame = true;
							gameOver();
							return true;
						}
					}
				}
			}
		}
		return true;
	}

	function drawItems(item) {
		item.draw(context, htmlCanvas);
	}

	function drawAll() {
		player.draw(context, htmlCanvas);
		asteroids.forEach(drawItems);
		if (player.particles.length > 0) {
			for (var i = 0; i < player.particles.length; i++) {
				if (player.particles[i].isLifetime()) {
					player.particles[i].draw(context);
				} else {
					player.particles.splice(i, 1);
				}
			}
		}
		if (player.shootParticles.length > 0) {
			for (var i = 0; i < player.shootParticles.length; i++) {
				if (player.shootParticles[i].isLifetime()) {
					player.shootParticles[i].draw(context);
				} else {
					player.shootParticles.splice(i, 1);
				}
			}
		}
		if (asteroidsParticles.length > 0) {
			for (var i = 0; i <= asteroidsParticles.length; i++) {
				if (asteroidsParticles[i] && asteroidsParticles[i].isLifetime()) {
					asteroidsParticles[i].draw(context);
				} else {
					asteroidsParticles.splice(i, 1);
				}
			}
		}
	}

	var endOfGame = false;
	var loopsPerSecond = 0;
	var fps = 0;
	var score = 0;

	function loop() {
		//date = new Date();
		keyUpdate();
		if (!endOfGame) {
			redraw();
			//showFPS(context);
			showScore(context);
			player.lastBasicShot++;
			drawAll();
			while(!checkAsteroids()) {
				checkAsteroids();
			}

			if (lastGeneratedAsteroid > 50 && asteroids.length < LIMIT_OF_MAX_ASTEROIDS) {
				var randX = Math.floor(Math.random()*htmlCanvas.width*+0+1);
				var y = htmlCanvas.height;
				asteroids.push(new Asteroid(new Vector(randX, y), SpeedVector.getRandSpeedVector(
					LIMIT_OF_MIN_ASTEROID_SPEED,
					LIMIT_OF_MAX_ASTEROID_SPEED)
				));
				lastGeneratedAsteroid = 0;
			}
			lastThrustEffect++;
			lastGeneratedAsteroid++;
		}
		/*
		if ((date.getSeconds() - lastSecond) >= 1) {
			calcFps();
			lastSecond = date.getSeconds();
			//GameLoopTime = (loopsPerSecond/16.6;
			loopsPerSecond = 0;
		}*/
	}
	var interval = setInterval(loop, 16.6);

});