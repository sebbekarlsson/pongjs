const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d"); // pappret vi ritar pa.

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const ball = new Ball(
  WIDTH / 2,    // x
  HEIGHT / 2,    // y
  16,     // width
  16,     // height
  ctx,    // papper
  "white"// farg
);
gameObjects.push(ball); // tryck in i listan

const pad1 = new Player(
  WIDTH-64,       // x
  (HEIGHT / 2) - (86/2),   // y
  32,           // width
  86,           // height
  ctx,          // papper
  "white"       // farg
);
gameObjects.push(pad1); // tryck in i listan

const pad2 = new Enemy(
  32,       // x
  (HEIGHT / 2) - (86/2),   // y
  32,           // width
  86,           // height
  ctx,          // papper
  "white"       // farg
);
gameObjects.push(pad2); // tryck in i listan

function loop() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, WIDTH, HEIGHT); // "rensar skarmen"

  ball.update();
  ball.draw();

  pad1.update();
  pad1.draw();

  pad2.update();
  pad2.draw();

  requestAnimationFrame(loop);
}

loop();
