class Asteroid extends GameObject{

	constructor(positionVector, speedVector, length = null) {
		super(positionVector, speedVector);
		this.startX = this.positionVector.x;
		this.startY = this.positionVector.y;
		this.loadVectors(length);
	}

	loadVectors(length = null) {
		this.countOfVectors = Math.floor(Math.random()*(LIMIT_OF_ASTEROID_MAX_VECTORS-LIMIT_OF_MIN_ASTEROID_VECTORS+1)+LIMIT_OF_MIN_ASTEROID_VECTORS);
		this.vectors = [];
		var degree = 360/this.countOfVectors;
		if (length !== null) {
			this.randomDefaultLengthLimit = length;
		} else {
			this.randomDefaultLengthLimit = Math.floor((Math.random()*LIMIT_OF_MAX_ASTEROID_LENGTH+LIMIT_OF_MIN_ASTEROID_LENGTH)+1);
		}

		var randomLength = 0;
		for(var i = 0; i < this.countOfVectors; i++) {
			if (randomLength === 0) {
				randomLength = Math.floor((Math.random()*(this.randomDefaultLengthLimit)+(this.randomDefaultLengthLimit/3))+1);
			} else {
			 	randomLength = Math.floor((Math.random()*(randomLength+randomLength/3)+(randomLength*2/3)));
			}
			if (this.randomDefaultLengthLimit < randomLength) {
				randomLength = this.randomDefaultLengthLimit*2/3;
			}
			this.vectors[i] = this.getVectorFromVectorAndAngle(
				0,
				0,
				degree*(i+1),
				randomLength
			);
		}
	}

	getVectorFromVectorAndAngle(x, y, angle, length) {
		var x2 = x + (length * Math.cos(angle* (Math.PI / 180)));
		var y2 = y + (length * Math.sin(angle* (Math.PI / 180)));
		return new Vector(x2, y2);
	}

	getLines() {
		var lines = [];

		for (var i = 0; i < this.countOfVectors-1; i++) {
			var firstVector = new Vector(
				this.vectors[i].x + this.positionVector.x,
				this.vectors[i].y + this.positionVector.y
			);
			var secondVector = new Vector(
				this.vectors[i+1].x + this.positionVector.x,
				this.vectors[i+1].y + this.positionVector.y
			);
			lines.push(new Line(firstVector, secondVector));
		}
		var firstVector = new Vector(
			this.vectors[this.countOfVectors-1].x + this.positionVector.x,
			this.vectors[this.countOfVectors-1].y + this.positionVector.y
		);
		var secondVector = new Vector(
			this.vectors[0].x + this.positionVector.x,
			this.vectors[0].y + this.positionVector.y
		);
		lines.push(new Line(firstVector, secondVector));
		return lines;
	}

	move(htmlCanvas) {
		if (this.positionVector.x > htmlCanvas.width) {
			this.positionVector.x = 0;
		}
		if (this.positionVector.x < 0) {
			this.positionVector.x = htmlCanvas.width;
		}
		if (this.positionVector.y > htmlCanvas.height) {
			this.positionVector.y = 0;
		}
		if (this.positionVector.y < 0) {
			this.positionVector.y = htmlCanvas.height;
		}
		this.positionVector.x += this.speedVector.speedX;
		this.positionVector.y += this.speedVector.speedY;
	}

	static generateAsteroid() {
		return new Asteroid(new Vector(200,200), SpeedVector.getRandSpeedVector(
			LIMIT_OF_MIN_ASTEROID_SPEED,
			LIMIT_OF_MAX_ASTEROID_SPEED)
		);
	}

	getBox() {
		return new Box(this.positionVector, this.randomDefaultLengthLimit*2, this.randomDefaultLengthLimit*2);
	}

	getExplodeParticles() {
		var asteroidsParticles = [];
		for (var i = 0; i <= 30; i++) {
			var angle =  Math.floor(Math.random()*360+1);
			var width =  Math.floor(Math.random()*5+1);
			var lenght = Math.floor(Math.random()*this.randomDefaultLengthLimit+1);
			var vector = this.getVectorFromVectorAndAngle(this.positionVector.x, this.positionVector.y, angle, lenght);
			asteroidsParticles.push(new Particle(vector, SpeedVector.getRandSpeedVector(-5, 5), width, 25, "white"));
		}
		return asteroidsParticles;
	}

	explode() {
		var newAsteroids = [];
		if (this.randomDefaultLengthLimit > LIMIT_OF_MIN_ASTEROID_LENGTH) {
			newAsteroids[0] = (new Asteroid(
				new Vector(this.positionVector.x,this.positionVector.y)	,
				SpeedVector.getRandSpeedVector(
					LIMIT_OF_MIN_ASTEROID_SPEED*2,
					LIMIT_OF_MAX_ASTEROID_SPEED*2
				),
				LIMIT_OF_MIN_ASTEROID_LENGTH
			));
			newAsteroids[1] = (new Asteroid(
				new Vector(this.positionVector.x,this.positionVector.y)	,
				SpeedVector.getRandSpeedVector(
					LIMIT_OF_MIN_ASTEROID_SPEED*2,
					LIMIT_OF_MAX_ASTEROID_SPEED*2
				),
				LIMIT_OF_MIN_ASTEROID_LENGTH
			));

		}
		var boomEffect = document.getElementById("boomEffect");
		boomEffect.currentTime = 0;
		boomEffect.play();
		return newAsteroids;
	}

	draw(context, htmlCanvas){
		this.move(htmlCanvas);
		context.strokeStyle = 'white';
		context.lineWidth = '2';
		context.fillStyle = 'black';
		context.beginPath();
		for (var i = 0; i < this.countOfVectors; i++) {
			context.lineTo((this.positionVector.x + this.vectors[i].x),(this.positionVector.y + this.vectors[i].y));
		}
		context.lineTo((this.positionVector.x + this.vectors[0].x), (this.positionVector.y + this.vectors[0].y));
		context.fill();
		context.stroke();
	}
}