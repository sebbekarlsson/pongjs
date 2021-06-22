const MOVE_SPEED = 5;
const BALL_SPEED = 3;
let gameObjects = [];
const keys = {};

const gameState = {
  enemyScore: 0,
  playerScore: 0,
  isRunning: false,
  locked: false,
  lastWinner: null
}

const PLAYERS = {
  enemy: 0,
  player: 1
}


function startGame() {
  gameState.isRunning = true;
}


// rack upp handen nar "locked" grejen fungerar.
function stopGame() {
  gameState.locked = true;

  gameState.isRunning = false;

  setTimeout(function(){
    gameState.locked = false;
  }, 1000);
}

// rack upp handen nar bollen borgar om fran mitten.

function insertBall() {
  const ball = new Ball(
    640 / 2,    // x
    480 / 2,    // y
    16,     // width
    16,     // height
    ctx,    // papper
    "white"// farg
  );
  gameObjects.push(ball); // tryck in i listan
}

function removeObject(objName) {
  gameObjects = gameObjects.filter(function(obj){
    return obj.constructor.name !== objName;
  });
}

function win(player) {
  removeObject("Ball");
  insertBall();

  gameState.lastWinner = player;

  if (player === PLAYERS.enemy) {
    gameState.enemyScore += 1;
  } else if (player === PLAYERS.player) {
    gameState.playerScore += 1;
  }

  stopGame();
}

function drawText(ctx, text, color, fontSize, x, y, center = false) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `${fontSize}px Arial`;

  // rack upp handen nar texten ar centrerad
  const metrics = ctx.measureText(text);

  if (center) {
    x -= metrics.width/2;
  }

  ctx.fillText(text, x, y);
  ctx.restore();
}

document.addEventListener("keydown", function(event){
  keys[event.key] = true;
});

document.addEventListener("keyup", function(event){
  keys[event.key] = false;
});



function getObject(objName, onlyOne = true) {
  // filtrera listan av GameObjects.
  const results = gameObjects.filter(function(obj){
    return obj.constructor.name === objName;
  });

  // kolla om vi hittat nagra objects.
  if (results.length) {
    if (onlyOne) {
      return results[0]; // returnera bara 1
    } else {
      return results; // returnera alla
    }
  }

  return null;
}
