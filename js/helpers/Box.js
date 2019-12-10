class Box {

	constructor(vector, width, length){
		this.vector = vector;
		this.width = width;
		this.length = length;
	}

	getLines() {
		var secondVector = new Vector(this.vector.x + this.width, this.vector.y);
		var thirdVector = new Vector(this.vector.x + this.width, this.vector.y + this.width);
		var fourthVector = new Vector(this.vector.x, this.vector.y + this.width);
		return [
			new Line(this.vector, secondVector),
			new Line(secondVector, thirdVector),
			new Line(thirdVector, fourthVector),
			new Line(fourthVector, this.vector)
		]
	}

	isColliding(box) {
		if (this.vector.x > box.vector.x) {
			var firstX = this.vector.x;
			var secondX = box.vector.x;
		} else {
			var firstX = box.vector.x;
			var secondX = this.vector.x;
		}

		var length = firstX - secondX;
		var halfWidth = this.width/2;
		var halfWidthBox = box.width/2;
		var gapBetweenBoxes = length - halfWidth - halfWidthBox;

		if (this.vector.y > box.vector.y) {
			var firstY = this.vector.y;
			var secondY = box.vector.y;
		} else {
			var firstY = box.vector.y;
			var secondY = this.vector.y;
		}

		var length2 = firstY - secondY;
		var halfWidth2 = this.length/2;
		var halfWidthBox2 = box.length/2;
		var gapBetweenBoxes2 = length2 - halfWidth2 - halfWidthBox2;

		return (gapBetweenBoxes <= 0 && gapBetweenBoxes2 <= 0);
	}

}