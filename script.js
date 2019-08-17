var canvas = document.getElementById("myCanvas");
var body = document.body;
var ctx = canvas.getContext("2d");
var x = canvas.width / 2,
  y = canvas.height - 70;
var dx = 1,
  dy = 1;
var ballRadius = 30;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;

var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var score = 0;
var lives = 3;
var maxScore = brickRowCount * brickColumnCount;
var pause = false;

var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (var r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

function drawBricks() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function collisionDetection() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      // The x position of the ball is greater than the x position of the brick.
      // The y position of the ball is greater than the y position of the brick.
      // The x position of the ball is less than the x position of the brick plus its width.
      //The y position of the ball is less than the y position of the brick plus its height.
      //but only if the brick is still alive...
      if (b.status == 1) {
        if (
          x + ballRadius > b.x &&
          y + ballRadius > b.y &&
          x - ballRadius < b.x + brickWidth &&
          y - ballRadius < b.y + brickHeight
        ) {
          console.log("It fucking happendeedd");
          //pause = true;
          dy = -dy;
          b.status = 0;
          score += 1;
          if (score >= maxScore) {
            alert("YOU WON MADDERFAKKER!");
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2, false);
  ctx.fillStyle = "green";
  ctx.fill();
  ctx.closePath();
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "green";
  ctx.fill();
  ctx.closePath();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();
  drawScore();
  drawLives();
  if (pause) {
    alert("GAME PAUSED");
    pause = false;
  }

  //Handle movement of the ball
  //change direction if out of bounds right or left bounds
  if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) dx = -dx;

  //change direction if out of bounds top
  if (y + dy < ballRadius) dy = -dy;

  //change direction if out of bounds down and reduce life by one

  if (x > paddleX && x < paddleX + paddleWidth) {
    if (y + dy > canvas.height - ballRadius - paddleHeight) {
      dy = -dy;
      dy *= 1.1;
    }
  } else if (x < paddleX || x > paddleX + paddleWidth) {
    if (y + dy > canvas.height - ballRadius) {
      lives -= 1;
      if (lives <= 0) {
        alert("GAME OVER!");
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 60;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  x += dx;
  y += dy;

  //Handle movement of the paddle
  if (leftPressed) {
    paddleX -= 7;
    if (paddleX < 0) {
      paddleX = 0;
    }
  } else if (rightPressed) {
    paddleX += 7;
    if (paddleX > canvas.width - paddleWidth) {
      paddleX = canvas.width - paddleWidth;
    }
  }
  requestAnimationFrame(draw);
}

function movePaddle(e) {
  console.log(e);
  switch (e.key) {
    case "ArrowRight":
      paddleX += 3;
      console.log("right!" + paddleX);
      break;
    case "ArrowLeft":
      paddleX -= 3;
      break;
  }
}

function keyDownHandler(e) {
  if ((e.key == "right") | (e.key == "ArrowRight")) {
    rightPressed = true;
  } else if ((e.key == "left") | (e.key == "ArrowLeft")) {
    leftPressed = true;
  } else if (e.keyCode == 32) {
    pause = true;
  }
}

function keyUpHandler(e) {
  if ((e.key == "right") | (e.key == "ArrowRight")) {
    rightPressed = false;
  } else if ((e.key == "left") | (e.key == "ArrowLeft")) {
    leftPressed = false;
  }
}

draw();

body.addEventListener("keydown", keyDownHandler, false);
body.addEventListener("keyup", keyUpHandler, false);
