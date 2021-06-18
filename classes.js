function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomDirection() {
  return getRandomNumber(0, 3) === 0 ? -1 : 1;
}

class GameObject {
  constructor(x, y, width, height, ctx, color) {
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.width = width;
    this.height = height;
    this.ctx = ctx;
    this.color = color;
  }

  update() {}

  defaultUpdate() {
    this.x += this.dx;
    this.y += this.dy;
  }

  checkCollision(exclude) {
    for (let i = 0; i < gameObjects.length; i++) {
      const obj = gameObjects[i];

      if (obj.constructor.name === exclude)
        continue;

      if (this.x + this.width >= obj.x && this.x <= obj.x + obj.width) {
        if (this.y + this.height >= obj.y && this.y <= obj.y + obj.height) {
          return true;
        }
      }
    }
  }

  // rack upp handen nar den spammar ut
  // objekt i consolen

  draw() {}
}


class Ball extends GameObject {
  constructor(x, y, width, height, ctx, color) {
    super(x, y, width, height, ctx, color); // kalla pa foralderns konstruktor.
    this.dir = getRandomDirection();
  }

  invertDirection() {
    this.dir = this.dir * -1;
  }

  update() {
    this.defaultUpdate();

    if (this.x < 0) {
      this.invertDirection();
    }

    if (this.x > 640) {
      this.invertDirection();
    }

    if (this.checkCollision("Ball")) {
      this.invertDirection();
    }

    this.dx = this.dir;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
 }
}


class Pad extends GameObject {
  constructor(x, y, width, height, ctx, color) {
    super(x, y, width, height, ctx, color); // kalla pa foralderns konstruktor.
  }

  update() {}

  draw() {
    this.ctx.fillStyle = this.color;  // doppa penseln i farg
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
