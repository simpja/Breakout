var canvas = document.getElementById("myCanvas");
var body = document.body;
var ctx = canvas.getContext("2d");
var x=canvas.width/2, y=canvas.height-30;
var dx=1,dy=1;
var ballRadius = 10;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;

// Du er på step 4

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2, false);
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.closePath();
}

function draw () {
    ctx.clearRect(0,0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();

    //Handle movement of the ball
    //change direction if out of bounds right or left bounds
    if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) dx = -dx;
    
    //change direction if out of bounds top
    if (y + dy < ballRadius) dy = -dy;
    
    //change direction if out of bounds down and reduce life by one
    if (y + dy > canvas.height - ballRadius){
        if (x > paddleX && x < paddleX + paddleWidth){
            dy = -dy;
        } else {
            alert ("GAME OVER!");
            document.location.reload();
            clearInterval(interval); //Needed for chrome to end game.
        }

    }
        
    
    x += dx;
    y += dy;

    //Handle movement of the paddle
    if (leftPressed){
        paddleX -= 7;
        if (paddleX < 0){
            paddleX = 0;
        }
    }
    else if (rightPressed){
        paddleX += 7;
        if (paddleX > canvas.width - paddleWidth){
            paddleX = canvas.width - paddleWidth;
        }
    }


}

function movePaddle(e) {
    console.log(e);
    switch(e.key){
        case "ArrowRight":
            paddleX += 7;
            console.log("right!" + paddleX)
            break;
        case "ArrowLeft":
            paddleX -= 7;
            break;
    }
}

function keyDownHandler(e){
    if (e.key == "right" | e.key == "ArrowRight"){
        rightPressed = true;
    } else if (e.key == "left" | e.key == "ArrowLeft"){
        leftPressed = true;
    }
};

function keyUpHandler(e){
    if (e.key == "right" | e.key == "ArrowRight"){
        rightPressed = false;
    } else if (e.key == "left" | e.key == "ArrowLeft"){
        leftPressed = false;
    }
};

var interval = setInterval(draw, 10);

body.addEventListener('keydown', keyDownHandler, false);
body.addEventListener('keyup', keyUpHandler, false);