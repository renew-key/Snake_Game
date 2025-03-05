const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
// getContext() will return a drawing context of canvas

const unit = 20;
const row = canvas.height / unit; // 320/20=16
const column = canvas.width / unit;

let snake = []; //each element in array is a object，and it will store (x,y)
(() => {
  snake[0] = {
    x: 80,
    y: 0,
  };

  snake[1] = {
    x: 60,
    y: 0,
  };

  snake[2] = {
    x: 40,
    y: 0,
  };

  snake[3] = {
    x: 20,
    y: 0,
  };
})();
class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }

  drawFruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  }
  pickLocation() {
    let overLapping = false;
    let newX;
    let newY;
    function checkOverLap(newX, newY) {
      for (let i = 0; i < snake.length; i++) {
        if (newX == snake[i].x && newY == snake[i].y) {
          return true;
        }
      }
      return false;
    }
    do {
      newX = Math.floor(Math.random() * column) * unit;
      newY = Math.floor(Math.random() * row) * unit;
      overLapping = checkOverLap(newX, newY);
      // console.log(overLapping);
    } while (overLapping);

    this.x = newX;
    this.y = newY;
  }
}

let myFruit = new Fruit();
let score = 0;
let heightestScore = Number(localStorage.getItem("heightestScore")) || 0;
document.getElementById("myScore").innerHTML = `Score:${score}`;
document.getElementById(
  "myScore2"
).innerHTML = `The Heighest Score:${heightestScore}`;
window.addEventListener("keydown", changeDirection);
let d = "Right";
function changeDirection(e) {
  switch (e.key) {
    case "ArrowLeft":
      if (d != "Right") d = "Left";
      break;
    case "ArrowRight":
      if (d != "Left") d = "Right";
      break;
    case "ArrowUp":
      if (d != "Down") d = "Up";
      break;
    case "ArrowDown":
      if (d != "Up") d = "Down";
      break;
    default:
      console.log(d);
  }
  window.removeEventListener("keydown", changeDirection);
}

function drawSnake() {
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "lightgreen";
    } else {
      ctx.fillStyle = "lightblue";
    }

    if (snake[i].x >= canvas.width) {
      snake[i].x = 0;
    } else if (snake[i].x < 0) {
      snake[i].x = canvas.width;
    }
    if (snake[i].y < 0) {
      snake[i].y = canvas.height;
    } else if (snake[i].y >= canvas.height) {
      snake[i].y = 0;
    }

    ctx.strokeStyle = "white";
    //x,y,width,height
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }
}

function drawDirction(snakeX, snakeY) {
  if (d == "Right") {
    snakeX += unit;
  } else if (d == "Up") {
    snakeY -= unit;
  } else if (d == "Left") {
    snakeX -= unit;
  } else if (d == "Down") {
    snakeY += unit;
  }
  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    myFruit.pickLocation();
    score++;
    document.getElementById("myScore").innerHTML = `Score:${score}`;
  } else {
    snake.pop();
  }
  snake.unshift(newHead);
  window.addEventListener("keydown", changeDirection);
}

function GameOver() {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(myGame);
      alert("Game Over!");

      if (score > heightestScore) {
        heightestScore = score;
        localStorage.setItem("heightestScore", heightestScore);
        document.getElementById(
          "myScore2"
        ).innerHTML = `The Heighest Score:${heightestScore}`;
      }
      score = 0;
      return true;
    }
  }
  return false;
}

function draw() {
  const gameover = GameOver();
  if (gameover) {
    return;
  }

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  myFruit.drawFruit();
  drawSnake();
  drawDirction(snake[0].x, snake[0].y);
}

let myGame = setInterval(draw, 100);
