class Line {

	constructor(startVector, endVector) {
		this.startVector = startVector;
		this.endVector = endVector;
	}

	intersect(line, ctx) {
		var det, gamma, lambda;
		//this.drawLine(ctx, "green");
		//line.drawLine(ctx, "red");
		det = (this.endVector.x - this.startVector.x)
			* (line.endVector.y - line.startVector.y)
			- (line.endVector.x - line.startVector.x)
			* (this.endVector.y - this.startVector.y);
		if (det === 0) {
			return false;
		} else {
			lambda = (
				(line.endVector.y - line.startVector.y)
				* (line.endVector.x - this.startVector.x)
				+ (line.startVector.x - line.endVector.x)
				* (line.endVector.y - this.startVector.y)
			) / det;
			gamma = (
				(this.startVector.y - this.endVector.y)
				* (line.endVector.x - this.startVector.x)
				+ (this.endVector.x - this.startVector.x)
				* (line.endVector.y - this.startVector.y)
			) / det;
			return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
		}
	}

	drawLine(ctx, color) {
		ctx.fillStyle = color;
		ctx.strokeStyle = color;
		ctx.lineWidth = '3';
		ctx.beginPath();
		ctx.moveTo(this.startVector.x, this.startVector.y);
		ctx.lineTo(this.endVector.x, this.endVector.y);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}
}