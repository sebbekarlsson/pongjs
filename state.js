const gameObjects = [];
const keys = {};

document.addEventListener("keydown", function(event){
  keys[event.key] = true;
});

document.addEventListener("keyup", function(event){
  keys[event.key] = false;
});
