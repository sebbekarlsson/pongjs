const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d"); // pappret vi ritar pa.

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

insertBall();

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

  // rack upp handen nar allt fungerar igen
  gameObjects.forEach(function(obj){
    obj.update();
    obj.draw();
  });

  drawText(
    ctx,
    `Enemy: ${gameState.enemyScore}`,
    "white",
    24,
    32,
    32
  );

  drawText(
    ctx,
    `Player: ${gameState.playerScore}`,
    "white",
    24,
    WIDTH - 128,
    32
  );

  // rack upp handen om ni ser texten
  if (gameState.locked) {
    drawText(
      ctx,
      gameState.lastWinner === PLAYERS.enemy ? "Enemy won!" : "You won!",
      "red",
      48,
      WIDTH/2,
      HEIGHT/2,
      true
    );
  }

  requestAnimationFrame(loop);
}

loop();
