function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomDirection() {
  return getRandomNumber(0, 360);
}


function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function getAngleBetween(p1x, p1y, p2x, p2y) {
  return Math.atan2(p2y - p1y, p2x - p1x) * 180 / Math.PI;
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
    this.radius = 0;
  }

  update() {}

  defaultUpdate() {
    const vel = 0.1;
    this.x += this.dx;
    this.y += this.dy;

    if (this.dx > 0) {
      if (this.dx - vel < 0) {
        this.dx = 0;
      } else {
        this.dx -= vel;
      }
    }

    if (this.dx < 0) {
      if (this.dx + vel > 0) {
        this.dx = 0;
      } else {
        this.dx += vel;
      }
    }

    if (this.dy > 0) {
      if (this.dy - vel < 0) {
        this.dy = 0;
      } else {
        this.dy -= vel;
      }
    }

    if (this.dy < 0) {
      if (this.dy + vel > 0) {
        this.dy = 0;
      } else {
        this.dy += vel;
      }
    }
  }

  checkCollision(exclude, xa = 0, ya = 0) {
    for (let i = 0; i < gameObjects.length; i++) {
      const obj = gameObjects[i];

      if (obj.constructor.name === exclude)
        continue;

      // rack upp handen nar
      // ni ser att bollen kolliderar
      // med vanstra paden korrekt
      if ((this.x + xa) + this.width >= obj.x && ((this.x + xa) - (this.radius*2)) <= obj.x + obj.width) {
        if ((this.y+ya) + this.height >= obj.y && (this.y+ya) <= obj.y + obj.height) {
          return obj;
        }
      }
    }
  }

  draw() {}
}

class Ball extends GameObject {
  constructor(x, y, width, height, ctx, color) {
    super(x, y, width, height, ctx, color); // kalla pa foralderns konstruktor.
    this.dir = getRandomNumber(0, 3) == 0 ? 180 : 0;
    this.radius = width / 2;
    this.push(this.dir, 10);
  }

  // byt ut till detta, rack upp handen
  invertDirection() {
   // this.dx = -this.dx;
    //this.dy = -this.dy;
    //this.dx = 0;
    //this.dy = 0;
    //this.dir = this.dir *-1;
  }

  push(dir, force) {
    this.dir = dir;
    this.dx += Math.cos(toRadians(dir)) * force;
    this.dy -= Math.sin(toRadians(dir)) * force;
  }

  move(xa, ya) {
    if (xa != 0 && ya != 0) {
      this.move(xa, 0);
      this.move(0, ya);
    }

    if (((this.x+xa) - this.radius*2) < 0) {
      this.invertDirection();
      this.dx = 0;
      this.push(0, 5);
      return;
    }
    if ((this.x+xa) + this.radius*2 > 640) {
      this.dx = 0;
      this.invertDirection();
      this.push(-180, 5);
      return;
    }
    if ((this.y+ya) - (this.radius*2) < 0) {
      this.dy = 0;
      this.invertDirection();
      this.push(270, 5)
      return;
    }
    if ((this.y+ya)+this.radius*2 > 480) {
      this.dy = 0;
      this.invertDirection();
      this.push(90, 5);
      return;
    }
    const obj = this.checkCollision("Ball", xa, ya);
    if (obj) {
      this.dx  += xa;
      this.dy += ya;
      this.push(-this.dir, 5);
      return;
    }

    this.x += xa;
    this.y += ya;
  }

  update() {
    this.move(this.dx, this.dy)
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

class Enemy extends Pad {
  constructor(x, y, width, height, ctx, color) {
    super(x, y, width, height, ctx, color); // kalla pa foralderns konstruktor.
  }

  update() {}

  draw() {
    this.ctx.fillStyle = this.color;  // doppa penseln i farg
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Player extends Pad {
  constructor(x, y, width, height, ctx, color) {
    super(x, y, width, height, ctx, color); // kalla pa foralderns konstruktor.
    this.speed = 4;
  }

  update() {
    if (keys["w"]) {
      this.y -= this.speed;
    }
    if (keys["s"]) {
      this.y += this.speed;
    }
  }

  draw() {
    this.ctx.fillStyle = this.color;  // doppa penseln i farg
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
