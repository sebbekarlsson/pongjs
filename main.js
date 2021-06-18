const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d"); // pappret vi ritar pa.



ball = new Ball(
  120,    // x
  120,    // y
  32,     // width
  32,     // height
  ctx,    // papper
  "white"// farg
);

ball.draw();
