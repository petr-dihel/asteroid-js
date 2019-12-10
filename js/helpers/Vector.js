class Vector {
	constructor(x, y) {
		this.x = Math.trunc(x);
		this.y = Math.trunc(y);
	}

	static getVectorFromVectorAndAngle(x, y, angle, length) {
			var x2 = x + (length * Math.cos(angle* (Math.PI / 180)));
		var y2 = y + (length * Math.sin(angle* (Math.PI / 180)));
		return new Vector(x2, y2);
	}

}