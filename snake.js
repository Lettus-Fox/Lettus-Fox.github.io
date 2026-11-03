const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const bestScoreEl = document.getElementById('best-score');
const overlay = document.getElementById('overlay');
const overlayText = document.getElementById('overlay-text');

const gridSize = 20;
const tileSize = canvas.width / gridSize;
const initialSnake = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 }
];

let snake;
let direction;
let queuedDirection;
let food;
let score;
let bestScore;
let gameLoop;
let isPlaying;

function init() {
  bestScore = Number(localStorage.getItem('snakeBestScore')) || 0;
  bestScoreEl.textContent = String(bestScore);
  resetGame();
  showOverlay('Press Space to start');
}

function resetGame() {
  snake = initialSnake.map((segment) => ({ ...segment }));
  direction = { x: 1, y: 0 };
  queuedDirection = { x: 1, y: 0 };
  score = 0;
  scoreEl.textContent = '0';
  food = generateFood();
  isPlaying = false;
  clearInterval(gameLoop);
  draw();
}

function startGame() {
  resetGame();
  isPlaying = true;
  overlay.classList.remove('show');
  gameLoop = setInterval(tick, 110);
}

function endGame() {
  isPlaying = false;
  clearInterval(gameLoop);
  if (score > bestScore) {
    bestScore = score;
    bestScoreEl.textContent = String(bestScore);
    localStorage.setItem('snakeBestScore', String(bestScore));
  }
  showOverlay('Game over! Press Space to play again');
}

function showOverlay(message) {
  overlayText.textContent = message;
  overlay.classList.add('show');
}

function tick() {
  if (!isPlaying) {
    return;
  }

  direction = queuedDirection;
  const nextHead = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };

  const hitsWall =
    nextHead.x < 0 ||
    nextHead.x >= gridSize ||
    nextHead.y < 0 ||
    nextHead.y >= gridSize;

  const hitsSelf = snake.some(
    (segment) => segment.x === nextHead.x && segment.y === nextHead.y
  );

  if (hitsWall || hitsSelf) {
    endGame();
    return;
  }

  snake.unshift(nextHead);

  if (nextHead.x === food.x && nextHead.y === food.y) {
    score += 1;
    scoreEl.textContent = String(score);
    food = generateFood();
  } else {
    snake.pop();
  }

  draw();
}

function generateFood() {
  let candidate;

  do {
    candidate = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize)
    };
  } while (snake.some((segment) => segment.x === candidate.x && segment.y === candidate.y));

  return candidate;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < gridSize; row += 1) {
    for (let col = 0; col < gridSize; col += 1) {
      const isDark = (row + col) % 2 === 0;
      ctx.fillStyle = isDark ? '#1d493f' : '#143f37';
      ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
    }
  }

  ctx.fillStyle = '#ff5d73';
  ctx.fillRect(food.x * tileSize + 5, food.y * tileSize + 5, tileSize - 10, tileSize - 10);

  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? '#9ef01a' : '#66d95d';
    const padding = index === 0 ? 2 : 4;
    ctx.fillRect(
      segment.x * tileSize + padding,
      segment.y * tileSize + padding,
      tileSize - padding * 2,
      tileSize - padding * 2
    );
  });
}

window.addEventListener('keydown', (event) => {
  const key = event.key;

  if (key === ' ') {
    event.preventDefault();
    if (!isPlaying) {
      startGame();
    }
    return;
  }

  if (!isPlaying) {
    return;
  }

  const nextDir = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 }
  }[key];

  if (!nextDir) {
    return;
  }

  const isOpposite = nextDir.x === -direction.x && nextDir.y === -direction.y;
  if (!isOpposite) {
    queuedDirection = nextDir;
  }
});

init();