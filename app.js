//canvas drawing area
const canvas = document.getElementById("myCanvas");
const canvas_height = canvas.height;
const canvas_width = canvas.width;
const ctx = canvas.getContext("2d");

//circle ball
let circle_x = 160;
let circle_y = 60;
let radius = 20;
//ball's movement
let xSpeed = 20;
let ySpeed = 20;
//ground stick
let ground_x = 100;
let ground_y = 500;
let ground_width = 100;
let ground_height = 5;
//brick
let brickArray = [];
let brick_width = 40;
let brick_height = 40;
let bricks_quantity = 15;
//count of ball hit the brick
let count = 0;

let myGame = setInterval(drawCircle, 25);

//makes brick constructor
class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = brick_width;
    this.height = brick_height;
    brickArray.push(this);
    //the brick exist or not -> optimization(depends on the ball hit brick,not the brickArray.length-> To avoid the excessive calculating or rendering
    this.visible = true;
  }
  drawBrick() {
    ctx.fillStyle = "#a26d25";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  //check the ball hit bricks oe not (= the ball in the brick's area or not)
  touchingBall(ballX, ballY) {
    return (
      ballX >= this.x - radius &&
      ballX <= this.x + this.width + radius &&
      ballY >= this.y - radius &&
      ballY <= this.y + this.height + radius
    );
  }
}
//get random i of the brick
function getRandomNum(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

//makes all random bricks
for (let i = 0; i < bricks_quantity; i++) {
  let brick = new Brick(
    getRandomNum(0, canvas_width - brick_width),
    getRandomNum(0, canvas_height - brick_height)
  );
}

//ground stick's movement
canvas.addEventListener("mousemove", (e) => {
  //cuz the css's setting(move the canvas to the center，make sure the ground_x is correctly to the mousemove's x -> need to be aware of canvas 在瀏覽器視窗中的偏移量
  //canvas.getBoundingClientRect().left 取得 canvas 元素相對於瀏覽器視窗左邊界的偏移量，
  const canvasOffsetLeft = canvas.getBoundingClientRect().left;
  ground_x = e.clientX - canvasOffsetLeft;
});

function drawCircle() {
  ctx.fillStyle = "#d6c99d";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //1.does it hit the brick?
  brickArray.forEach((brick, index) => {
    //true->change the direction, speed of the ball & brick disappear(remove from brickArr)
    if (brick.visible && brick.touchingBall(circle_x, circle_y)) {
      count++;
      brick.visible = false;
      //from down / up hit
      if (circle_y >= brick.y + brick.height || circle_y <= brick.y) {
        ySpeed *= -1;
        //from right / left
      } else if (circle_x >= brick.x + brick.width || circle_x <= brick.x) {
        xSpeed *= -1;
      }

      if (count == bricks_quantity) {
        alert("Congratulations !!! You WIN !!!");
        clearInterval(myGame);
      }
    }
  });
  //2.does it hit the ground stick?
  if (
    circle_x >= ground_x - radius &&
    ground_x + ground_width + radius >= circle_x &&
    circle_y >= ground_y - radius &&
    circle_y <= ground_y + ground_height + radius
  ) {
    //add some bounce on the ground stick, let the ball bounce harder
    if (ySpeed > 0) {
      circle_y -= 40;
    } else {
      circle_y += 40;
    }
    //change the direction
    ySpeed *= -1;
  }
  //3.does it hit the canvas's boundary?
  //right & left boundary
  if (circle_x >= canvas.width - radius || circle_x <= radius) {
    xSpeed *= -1;
    //down & up boundary
  } else if (circle_y >= canvas.height - radius || circle_y <= radius) {
    ySpeed *= -1;
  }
  //the ball actual x,y (need to add on the movement)
  circle_x += xSpeed;
  circle_y += ySpeed;

  //4. draw the ball
  ctx.beginPath();
  ctx.arc(circle_x, circle_y, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = "black solid";
  ctx.stroke();
  ctx.fillStyle = "#925749";
  ctx.fill();

  //5. draw the bricks
  brickArray.forEach((brick) => {
    if (brick.visible) {
      brick.drawBrick();
    }
  });
  //5. draw the ground stick
  ctx.fillStyle = "black";
  ctx.fillRect(ground_x, ground_y, ground_width, ground_height);
}
