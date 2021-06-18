class GameObject {
  constructor(x, y, width, height, ctx, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.ctx = ctx;
    this.color = color;
  }

  update() {}

  draw() {}
}


class Ball extends GameObject {
  constructor(x, y, width, height, ctx, color) {
    super(x, y, width, height, ctx, color); // kalla pa foralderns konstruktor.
  }

  update() {}

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
 }
}

// rack upp handen nar ni ser en cirkel
