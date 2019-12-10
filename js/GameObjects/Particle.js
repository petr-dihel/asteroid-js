class Particle extends GameObject{

	constructor(vector, speedVector, width, lifeTime, color) {
		super(vector, speedVector);
		this.width = width;
		this.lifeTime = lifeTime;
		this.color = color;
	}

	move() {
		this.positionVector.x += this.speedVector.speedX;
		this.positionVector.y += this.speedVector.speedY;
	}

	getBox() {
		return new Box(this.positionVector, this.width, this.width);
	}

	isLifetime() {
		return this.lifeTime > 0;
	}

	draw(ctx) {
		this.move();
		this.lifeTime--;
		ctx.fillStyle = this.color;
		ctx.fillRect(this.positionVector.x, this.positionVector.y, this.width, this.width);
	}
}