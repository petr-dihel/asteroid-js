class SpeedVector{

	constructor (speedX, speedY) {
		this.speedX = speedX;
		this.speedY = speedY;
	}

	checkSpeedLimitX(x) {
		if (this.speedX + x < SPEED_LIMIT && this.speedX + x > -SPEED_LIMIT) {
			return true;
		}
		return false;
	}

	checkSpeedLimitY(y) {
		if (this.speedY + y < SPEED_LIMIT  && this.speedY + y > -SPEED_LIMIT) {
			return true;
		}
		return false;
	}

	addSpeed (x, y) {
		this.speedX += x;
		this.speedY += y;
	}

	static getRandSpeedVector(minimumLimit, maximumLimit) {
		var randX = Math.floor(Math.random()*2*maximumLimit+minimumLimit+1);
		var randY = Math.floor(Math.random()*2*maximumLimit+minimumLimit+1);
		if (randX > maximumLimit/2) {
			randX *= -1;
		}
		if (randY > maximumLimit/2) {
			randY *= -1;
		}
		return new SpeedVector(randX, randY);
	}
}