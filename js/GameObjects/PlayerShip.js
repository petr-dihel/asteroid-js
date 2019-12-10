class PlayerShip extends GameObject {

	constructor(x, y) {
		super(new Vector(x, y), new SpeedVector(0,0));
		this.angle = 0;
		this.particles = [];
		this.shootParticles = [];
		this.lastBasicShot = 0;
	}

	move(ctx, htmlCanvas) {
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

	addSpeed() {
		var x = Math.cos(this.angle* (Math.PI / 180))/10.0;
		var y = Math.sin(this.angle* (Math.PI / 180))/10.0;
		if (!this.speedVector.checkSpeedLimitX(x)) {
			x = 0;
		}
		if (!this.speedVector.checkSpeedLimitY(y)) {
			y = 0;
		}
		this.speedVector.addSpeed(x, y);

		for (var i = 0; i <= LIMIT_OF_PARTICLES_FRONT_THRUST; i++ ) {
			var randVector = this.getRandVector();
			var particleVector = this.getVectorFromVectorAndAngle(
				this.positionVector.x+i*randVector.x,
				this.positionVector.y+i*randVector.y,
				this.angle-180,
				20
			);

			var particleSpeedVector = this.getParticleSpeedVector();
			particleSpeedVector.speedX *= FRONT_THRUST_SHOT_SPEED;
			particleSpeedVector.speedY *= FRONT_THRUST_SHOT_SPEED;
			var particleWidth = Math.floor(Math.random()*(2-1+1)+1);
			this.particles.push(
				new Particle(
					particleVector,
					particleSpeedVector,
					particleWidth,
					LIFETIME_OF_PARTICLES_FRONT_THRUST,
					COLOR_OF_PARTICLES_FRONT_THRUST
				)
			);
		}
	}

	getBox() {
		return new Box(this.positionVector, 25, 25);
	}

	getLines() {
		var frontOfShip = this.getVectorFromVectorAndAngle(this.positionVector.x, this.positionVector.y, this.angle, 15);
		var secondPoint = this.getVectorFromVectorAndAngle(frontOfShip.x, frontOfShip.y, this.angle+20, -30);
		var thirdPoint = this.getVectorFromVectorAndAngle(frontOfShip.x, frontOfShip.y, this.angle-20, -30);
		return [
			new Line(frontOfShip, secondPoint),
			new Line(frontOfShip, thirdPoint),
			new Line(secondPoint, thirdPoint)
		];
	}

	getRandVector() {
		var randX = Math.floor(Math.random()*6+1);
		var randY = Math.floor(Math.random()*6+1);
		if (randX > 3) {
			randX *= -1;
		}
		if (randY > 3) {
			randY *= -1;
		}
		return new Vector(randX, randY);
	}

	getParticleSpeedVector() {
		var x = Math.cos(this.angle* (Math.PI / 180));
		var y = Math.sin(this.angle* (Math.PI / 180));
		return new SpeedVector(-x,-y);
	}

	leftRotation() {
		if (this.angle === 360) {
			this.angle = ANGLE_ROTATION_SPEED;
		} else {
			this.angle += ANGLE_ROTATION_SPEED;
		}
	}

	rightRotation() {
		if (this.angle === 0) {
			this.angle = 360 - ANGLE_ROTATION_SPEED;
		} else {
			this.angle -= ANGLE_ROTATION_SPEED;
		}
	}

	shot() {
		if (this.lastBasicShot < BASIC_SHOT_TIME_LIMIT) {
			this.lastBasicShot = 0;
			return;
		}
		this.lastBasicShot = 0;
		var particleVector = this.getVectorFromVectorAndAngle(
			this.positionVector.x,
			this.positionVector.y,
			this.angle,
			20
		);
		var speedVector = this.getParticleSpeedVector();
		speedVector.speedX *= -BASIC_SHOT_SPEED;
		speedVector.speedY *= -BASIC_SHOT_SPEED;
		this.shootParticles.push(
			new Particle(
				particleVector,
				speedVector,
				BASIC_SHOT_WIDTH,
				BASIC_SHOT_LIFETIME,
				BASIC_SHOT_COLOR
			)
		);

		var pewSound = document.getElementById("pewEffect");
		pewSound.currentTime = 0;
		pewSound.play();
	}

	backThrusters() {
		var x = -1*Math.cos(this.angle* (Math.PI / 180))/5;
		var y = -1*Math.sin(this.angle* (Math.PI / 180))/5;
		if (!this.speedVector.checkSpeedLimitX(x)) {
			x = 0;
		}
		if (!this.speedVector.checkSpeedLimitY(y)) {
			y = 0;
		}

		for (var i = 0; i <= LIMIT_OF_PARTICLES_BACK_THRUST; i++ ) {
			var randVector = this.getRandVector();
			var particleVector = this.getVectorFromVectorAndAngle(
				this.positionVector.x+i*randVector.x,
				this.positionVector.y+i*randVector.y,
				this.angle,
				20
			);
			var particleSpeedVector = this.getParticleSpeedVector();
			particleSpeedVector.speedX = -particleSpeedVector.speedX * BACK_THRUST_SHOT_SPEED;
			particleSpeedVector.speedY = -particleSpeedVector.speedY * BACK_THRUST_SHOT_SPEED;
			var particleWidth = Math.floor(Math.random()*(2-1+1)+1);
			this.particles.push(
				new Particle(
					particleVector,
					particleSpeedVector,
					particleWidth,
					LIFETIME_OF_PARTICLES_BACK_THRUST,
					COLOR_OF_PARTICLES_BACK_THRUST
				)
			);
		}
		this.speedVector.addSpeed(x, y);
	}

	getVectorFromVectorAndAngle(x, y, angle, length) {
		var x2 = x + (length * Math.cos(angle* (Math.PI / 180)));
		var y2 = y + (length * Math.sin(angle* (Math.PI / 180)));
		return new Vector(x2, y2);
	}

	draw(ctx, htmlCanvas) {

		this.move(ctx, htmlCanvas);
		var frontOfShip = this.getVectorFromVectorAndAngle(this.positionVector.x, this.positionVector.y, this.angle, 15);
		ctx.fillStyle = 'black';
		ctx.strokeStyle = 'white';
		ctx.lineWidth = '2';

		ctx.beginPath();
		ctx.moveTo(frontOfShip.x, frontOfShip.y);
		var secondPoint = this.getVectorFromVectorAndAngle(frontOfShip.x, frontOfShip.y, this.angle+20, -30);
		ctx.lineTo(secondPoint.x, secondPoint.y);

		ctx.moveTo(frontOfShip.x, frontOfShip.y);
		var thirdPoint = this.getVectorFromVectorAndAngle(frontOfShip.x, frontOfShip.y, this.angle-20, -30);
		ctx.lineTo(thirdPoint.x, thirdPoint.y);
		ctx.lineTo(secondPoint.x, secondPoint.y);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();

	}

}