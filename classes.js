class GameObject {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  update() {}

  draw() {}
}


class Ball extends GameObject {
  constructor(x, y, width, height) {
    super(x, y, width, height);
  }

  update() {}

  draw() {}
}

// rack upp handen nar ni har Ball klassen.
