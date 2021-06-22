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

  checkCollision(objName, xa = 0, ya = 0) {
    for (let i = 0; i < gameObjects.length; i++) {
      const obj = gameObjects[i];

      if (obj.constructor.name !== objName)
        continue;

      if ((this.x + xa) + this.width >= obj.x && ((this.x + xa) - (this.radius*2)) <= obj.x + obj.width) {
        if ((this.y+ya) + this.height >= obj.y && (this.y+ya) <= obj.y + obj.height) {
// rack upp handen nar ni lagt till detta
          const point = {
            x: Math.max(this.x + xa, obj.x) - Math.min(this.x + xa, obj.x),
            y: Math.max(this.y + ya, obj.y) - Math.min(this.y + ya, obj.y),
          };

          return { obj: obj, point: point };
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

  push(dir, force) {
    this.dir = dir;
    this.dx += Math.cos(toRadians(dir)) * force;
    this.dy -= Math.sin(toRadians(dir)) * force;
  }

  move(xa, ya) {
    if (!gameState.isRunning) return;

    if (xa != 0 && ya != 0) {
      this.move(xa, 0);
      this.move(0, ya);
    }

    // bollen nuddar vanster kanten av skarmen
    if (((this.x+xa) - this.radius*2) < 0) {
      win(PLAYERS.player); // rack upp handen nar ni kan fa poang.
      this.dx = 0;
      this.push(0, BALL_SPEED);
      return;
    }

    // bollen nuddar hoger kanten av skarmen
    if ((this.x+xa) + this.radius*2 > 640) {
      win(PLAYERS.enemy);
      this.dx = 0;
      this.push(-180, BALL_SPEED);
      return;
    }
    if ((this.y+ya) - (this.radius*2) < 0) {
      this.dy = 0;
      this.push(270, BALL_SPEED)
      return;
    }
    if ((this.y+ya)+this.radius*2 > 480) {
      this.dy = 0;
      this.push(90, BALL_SPEED);
      return;
    }

    const dataPlayer = this.checkCollision("Player", xa, ya);
    if (dataPlayer) {
      const obj = dataPlayer.obj;
      const point = dataPlayer.point;
      this.x -= point.x;

      if (point.y < obj.height / 2) {
        this.dx = 0;
        this.dy = 0;
        // vi har nuddat overdelen av plattan.
        this.push(160, BALL_SPEED);
      }
      else if (point.y > obj.height / 2) {
        this.dx = 0;
        this.dy = 0;
        // vi har nuddat underdelen.
        this.push(200, BALL_SPEED);
      } else {
        // vi har nuddat mitten.
        this.dx = 0;
        this.dy = 0;
        this.push(180, BALL_SPEED);
      }

      return;
    }

    const dataEnemy = this.checkCollision("Enemy", xa, ya);
    if (dataEnemy) {
      const obj = dataEnemy.obj;
      const point = dataEnemy.point;
      this.x += point.x;

      if (point.y < obj.height / 2) {
        this.dx = 0;
        this.dy = 0;
        // vi har nuddat overdelen av plattan.
        this.push(20, BALL_SPEED);
      }
      else if (point.y > obj.height / 2) {
        this.dx = 0;
        this.dy = 0;
        // vi har nuddat underdelen.
        this.push(340, BALL_SPEED);
      } else {
        // vi har nuddat mitten.
        this.dx = 0;
        this.dy = 0;
        this.push(0, BALL_SPEED);
      }

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

//  rack upp handen nar ni har detta
class Enemy extends Pad {
  constructor(x, y, width, height, ctx, color) {
    super(x, y, width, height, ctx, color); // kalla pa foralderns konstruktor.
    this.eyeY = 0;
    this.eyeSpeed = 4;
  }

  moveEye(toY) {
    if (this.eyeY < toY) {
      this.eyeY += this.eyeSpeed;
    }

    if (this.eyeY > toY) {
      this.eyeY -= this.eyeSpeed;
    }
  }


  // rack upp handen nar enemy inte ror sig utanfor skarmen
  move(toY) {
    if (this.y > toY && (this.y - MOVE_SPEED) > 0) {
      this.y -= MOVE_SPEED;
    }

    if (this.y < toY && ((this.y + this.height) + MOVE_SPEED) < 480) {
      this.y += MOVE_SPEED;
    }
  }

  update() {
    const ball = getObject("Ball");
    this.moveEye(ball.y);
    this.move(this.eyeY);
  }

  draw() {
    const ball = getObject("Ball");
    const angle = 180 + getAngleBetween(ball.x, this.eyeY, this.x, this.y);
    const radians = toRadians(angle);
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + Math.cos(radians) * 300, this.y + Math.sin(radians) * 300);
    ctx.stroke();
    this.ctx.fillStyle = this.color;  // doppa penseln i farg
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Player extends Pad {
  constructor(x, y, width, height, ctx, color) {
    super(x, y, width, height, ctx, color); // kalla pa foralderns konstruktor.
    this.speed = MOVE_SPEED;
  }

  // rack upp handen nar ni inte kan rora er utanfor rutan
  update() {
    if (gameState.locked) return;

    if (keys["w"] && (this.y - this.speed) > 0) {
      startGame();
      this.y -= this.speed;
    }
    if (keys["s"] && ((this.y + this.height) + this.speed) < 480) {
      startGame();
      this.y += this.speed;
    }
  }

  draw() {
    this.ctx.fillStyle = this.color;  // doppa penseln i farg
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
