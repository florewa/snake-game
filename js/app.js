const BLOCK_SIZE = 20;
const FIELD_WIDTH = 20;
const FIELD_HEIGHT = 17;
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = FIELD_WIDTH * BLOCK_SIZE;
canvas.height = FIELD_HEIGHT * BLOCK_SIZE;

let snake = [
  {x: 4, y: 2},
  {x: 3, y: 2},
  {x: 2, y: 2},
  {x: 1, y: 2}
];
let food = {x: 15, y: 10};
let currentDir = 'right';
let nextDir = 'right';
let gameLoop;
let isGameOver = false;

const drawBlock = (x, y, color) => {
  ctx.fillStyle = color;
  ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

const clearBlock = (x, y) => {
  ctx.clearRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

const generateFood = () => {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * FIELD_WIDTH),
      y: Math.floor(Math.random() * FIELD_HEIGHT)
    };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  food = newFood;
  drawBlock(food.x, food.y, '#e74c3c');
}

const checkCollision = (head) => {
  if (head.x < 0 || head.x >= FIELD_WIDTH || head.y < 0 || head.y >= FIELD_HEIGHT) {
    return true;
  }
  return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
}

const moveSnake = () => {
  if (isGameOver) return;

  const head = {...snake[0]};
  console.log(head)

  switch (nextDir) {
    case 'up':
      if (currentDir !== 'down') currentDir = nextDir;
      break;
    case 'down':
      if (currentDir !== 'up') currentDir = nextDir;
      break;
    case 'left':
      if (currentDir !== 'right') currentDir = nextDir;
      break;
    case 'right':
      if (currentDir !== 'left') currentDir = nextDir;
      break;
  }

  // Обновление позиции головы
  switch (currentDir) {
    case 'up':
      head.y--;
      break;
    case 'down':
      head.y++;
      break;
    case 'left':
      head.x--;
      break;
    case 'right':
      head.x++;
      break;
  }

  if (checkCollision(head)) {
    isGameOver = true;
    alert('Game Over! Score: ' + (snake.length - 4));
    clearInterval(gameLoop);
    return;
  }

  // Добавление новой головы
  snake.unshift(head);
  drawBlock(head.x, head.y, '#3498db');

  // Проверка еды
  if (head.x === food.x && head.y === food.y) {
    generateFood();
  } else {
    // Удаление хвоста
    const tail = snake.pop();
    clearBlock(tail.x, tail.y);
  }
}

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp':
      nextDir = 'up';
      break;
    case 'ArrowDown':
      nextDir = 'down';
      break;
    case 'ArrowLeft':
      nextDir = 'left';
      break;
    case 'ArrowRight':
      nextDir = 'right';
      break;
  }
});

const initGame = () => {
  snake.forEach(segment => drawBlock(segment.x, segment.y, '#3498db'));
  drawBlock(food.x, food.y, '#e74c3c');

  gameLoop = setInterval(moveSnake, 200);
}

initGame();
