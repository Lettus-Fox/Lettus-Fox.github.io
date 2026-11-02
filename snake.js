let canvasWidth = 600;
let canvasHeight = 600;

let snake = [];
let foodX;
let foodY;

let score = 0;
let highScore = 0;

let size = 25;

let xSpeed = 0;
let ySpeed = 0;
let moveCount = 0;

let gameState = "start";

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  frameRate(60);

  highScore = Number(localStorage.getItem("snakeHighScore")) || 0;

  resetGame();
}

function resetGame() {
  snake = [
    { x: 250, y: 300 },
    { x: 225, y: 300 },
    { x: 200, y: 300 }
  ];

  xSpeed = 0;
  ySpeed = 0;

  score = 0;
  moveCount = 0;

  makeFood();
}

function draw() {
  background("#895123");

  // Checker Board
  fill("#A1D99B");
  rect(100, 100, 100, 100, 10, 0);
  rect(200, 200, 100, 100);
  rect(300, 300, 100, 100);
  rect(400, 400, 100, 100, 0, 0, 10, 0);
  rect(100, 300, 100, 100);
  rect(200, 400, 100, 100);
  rect(300, 100, 100, 100);
  rect(400, 200, 100, 100);

  fill("#74C476");
  rect(200, 100, 100, 100);
  rect(400, 100, 100, 100, 0, 10, 0, 0);
  rect(100, 200, 100, 100);
  rect(300, 200, 100, 100);
  rect(200, 300, 100, 100);
  rect(100, 400, 100, 100, 0, 0, 0, 10);
  rect(400, 300, 100, 100);
  rect(300, 400, 100, 100);

  noFill();
  stroke("#A1D99B");
  rect(100, 100, 400, 400, 10);
  noStroke();

  // Move snake
  if (gameState === "playing") {
    moveCount++;

    if (moveCount >= 8) {
      moveSnake();
      moveCount = 0;
    }
  }

  // Draw Food
  fill("red");
  rect(foodX, foodY, size, size, 5);

  // Draw Snake
  for (let i = 0; i < snake.length; i++) {
    if (i === 0) {
      fill("#145A32");
    } else {
      fill("#2ECC71");
    }

    rect(snake[i].x, snake[i].y, size, size, 5);
  }

  // Score Bar
  fill("white");
  textSize(20);
  textAlign(LEFT);
  text("Score: " + score, 15, 30);
  text("High Score: " + highScore, 15, 55);

  // Start screen
  if (gameState === "start") {
    drawMessage(
      "SNAKE GAME",
      "Press SPACE to start",
      "Use Arrow Keys to Move"
    );
  }

  // Game over screen
  if (gameState === "over") {
    drawMessage(
      "GAME OVER",
      "Score: " + score,
      "Press SPACE to play again"
    );
  }
}

function moveSnake() {
  if (xSpeed === 0 && ySpeed === 0) return;

  let head = {
    x: snake[0].x + xSpeed,
    y: snake[0].y + ySpeed
  };

  // Wall collision
  if (
    head.x < 100 ||
    head.x >= 500 ||
    head.y < 100 ||
    head.y >= 500
  ) {
    endGame();
    return;
  }

  let eating = head.x === foodX && head.y === foodY;

  let bodyToCheck = eating ? snake : snake.slice(0, -1);

  // Self collision
  for (let part of bodyToCheck) {
    if (head.x === part.x && head.y === part.y) {
      endGame();
      return;
    }
  }

  snake.unshift(head);

  if (eating) {
    score++;

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("snakeHighScore", highScore);
    }

    makeFood();
  } else {
    snake.pop();
  }
}

function makeFood() {
  do {
    foodX = 100 + floor(random(16)) * size;
    foodY = 100 + floor(random(16)) * size;
  } while (
    snake.some(part => part.x === foodX && part.y === foodY)
  );
}

function endGame() {
  gameState = "over";
  xSpeed = 0;
  ySpeed = 0;
}

function drawMessage(title, line1, line2) {
  fill(0, 0, 0, 190);
  rect(100, 200, 400, 180, 15);

  fill("white");
  textAlign(CENTER);

  textSize(36);
  text(title, 300, 250);

  textSize(20);
  text(line1, 300, 295);

  textSize(16);
  text(line2, 300, 335);

  textAlign(LEFT);
}

function keyPressed() {
  // Space = start/restart
  if (keyCode === 32) {
    if (gameState === "start" || gameState === "over") {
      resetGame();
      gameState = "playing";
    }
    return false;
  }

  if (gameState !== "playing") {
    return false;
  }

  // Key Movement
  if (keyCode === LEFT_ARROW && xSpeed === 0) {
    xSpeed = -size;
    ySpeed = 0;
  }
  else if (keyCode === RIGHT_ARROW && xSpeed === 0) {
    xSpeed = size;
    ySpeed = 0;
  }
  else if (keyCode === UP_ARROW && ySpeed === 0) {
    xSpeed = 0;
    ySpeed = -size;
  }
  else if (keyCode === DOWN_ARROW && ySpeed === 0) {
    xSpeed = 0;
    ySpeed = size;
  }

  return false;
}