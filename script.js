var side;
var width;
var height;
var ballWidth = 30;
var ballHeight = 30;

var playerSpeed;
var playerHeight;
var ballScale;
var randomness;

var getSettings = true;
var gameOver = false;

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.sc = 3;
  }
  add(v) {
    this.x += v.x;
    this.y += v.y;
  }
  scale(s) {
    this.x *= s;
    this.y *= s;
    this.sc *= s;
  }
}

class Ball {
  constructor(v) {
    this.location = v;
    let goDown = true;
    if (Math.random > 0.5) {
      goDown = false;
    }
    this.velocity = new Vector(Math.floor(Math.random() - 7), (Math.floor(Math.random() * 3) + 3) * goDown);
    this.hits = 0;
  }
  scaleVelocity() {
    if (this.hits % ballScale === 0 && Math.abs(this.velocity.x) < width / 50) {
      this.velocity.scale(1.1);
    }
  }
  bounceOffWalls(floor, height) {
    if (this.location.y > height || this.location.y < floor) {
      this.velocity.y *= -1;
    }
  }
  bounceOffPlayer(s1, player) {
    if (this.location.x < s1) {
      this.velocity.x *= -1;
      this.velocity.y += ((Math.random() * 2) - 1) * this.velocity.sc * randomness;
    }
    else if (this.location.x > player.location.x - ballWidth / 2 && this.location.x < player.location.x && (this.location.y > player.location.y && this.location.y < player.location.y + playerHeight)) {
      this.velocity.x *= -1;
      this.velocity.y += ((Math.random() * 2) - 1) * this.velocity.sc * randomness;
      this.hits += 1;
      this.scaleVelocity();
    }
  }
  update (s1, paddle, floor, height) {
    this.bounceOffPlayer(s1, paddle);
    this.bounceOffWalls(floor, height);
    this.location.add(this.velocity);
  }

  reset () {
    this.location = new Vector(width / 2, height / 2);
    let goDown = true;
    if (Math.random > 0.5) {
      goDown = false;
    }
    this.velocity = new Vector(Math.floor(Math.random() - 7), (Math.floor(Math.random() * 3) + 3) * goDown);
    this.hits = 0;
  }
}

class Paddle {
  constructor(v) {
    this.location = v;
  }
  update(bottom) {
    if (keyIsPressed && keyCode === UP_ARROW && this.location.y > 0) {
      this.location.y -= playerSpeed;
    }
    else if (keyIsPressed && keyCode === DOWN_ARROW && this.location.y < bottom) {
      this.location.y += playerSpeed;
    }
  }
}

class Setting {
  constructor(x, y, width, height, s, min, max) {
    this.x = x;
    this.y = y;
    this.innerX = x;
    this.width = width;
    this.height = height;
    this.prompt = s;
    this.min = min;
    this.max = max;
  }
  update () {
    if (mouseIsPressed && mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height) {
      this.innerX = mouseX;
    }
  }
  param () {
    return Math.round(((this.innerX - this.x) / this.width) * (this.max - this.min) + this.min);
  }
}

var paddle;
var ball;

var playerHeightSetting;
var ballSpeedIncrements;
var playerSpeedSetting;
var randomnessSetting;

function setup() {
  width = windowWidth;
  height = windowHeight;
  createCanvas(windowWidth, windowHeight);
  background(255);
  ball = new Ball(new Vector(width / 2, height / 2));
  side = windowWidth / 10 + 40;
  
  paddle = new Paddle(new Vector(width - side, height / 2));

  playerHeightSetting = new Setting(width / 2 - 250, 200, 500, 50, "Paddle Length: ", 30, 270);
  ballSpeedIncrements = new Setting(width / 2 - 250, 300, 500, 50, "Moves it Takes to Scale Ball Speed: ", 1, 10);
  playerSpeedSetting = new Setting(width / 2 - 250, 400, 500, 50, "Paddle Speed: ", 3, 15);
  randomnessSetting = new Setting(width / 2 - 250, 500, 500, 50, "Ball Randomness Percent: ", 0, 100);
}

var bar = function(setting) {
  fill(0, 0, 0);
  textSize(17);
  textAlign(LEFT);
  text(setting.prompt + setting.param(), int(setting.x), int(setting.y - 10));
  stroke(0, 0, 0);
  strokeWeight(2);
  fill(100, 100, 100);
  rect(int(setting.x), int(setting.y), int(setting.width), int(setting.height));
  noStroke();
  fill(150, 150, 150);
  rect(int(setting.x) + 1, int(setting.y) + 1, - int(setting.x) + int(setting.innerX), int(setting.height) - 2);
}


draw = function() {
  if (getSettings) {
    fill (230, 230, 250);
    rect (0, 0, width, height);
    fill(0, 0, 0);
    textSize(28);
    textAlign(CENTER);
    text("Welcome to Pong! Enter your preferences below.", width / 2, 100);
    text("Press enter to begin. Have fun!", width / 2, height - 150);
    
    bar(playerHeightSetting);
    bar(ballSpeedIncrements);
    bar(playerSpeedSetting);
    bar(randomnessSetting);
    
    playerHeightSetting.update();
    ballSpeedIncrements.update();
    playerSpeedSetting.update();
    randomnessSetting.update();
    
    if (keyIsPressed && keyCode === 13) {
      playerHeight = int(playerHeightSetting.param());
      ballScale = int(ballSpeedIncrements.param());
      playerSpeed = int(playerSpeedSetting.param());
      randomness = int(randomnessSetting.param()) / 100.0;
      getSettings = false;
    }
  }
  else if (gameOver) {
    fill(230, 230, 250);
    rect(0, 0, width, height);
    fill(0, 0, 0);
    textSize(100);
    textAlign(CENTER);
    text("You Lost!", width / 2, 250);
    stroke(50, 50, 50);
    strokeWeight(2);
    fill(200, 200, 200);
    rect(width / 2 - 200, height / 2, 400, 100);
    rect(width / 2 - 200, height / 2 + 150, 400, 100);
    noStroke();
    fill(0, 0, 0);
    textSize(50);
    text("Try again", width / 2, height / 2 + 67);
    text("Go to settings", width / 2, height / 2 + 217);
    if (mouseIsPressed && mouseX < width / 2 + 200 && mouseX > width / 2 - 200 && mouseY > height / 2 && mouseY < height / 2 + 100) {
      gameOver = false;
      ball.reset();
    }
    else if (mouseIsPressed && mouseX < width / 2 + 200 && mouseX > width / 2 - 200 && mouseY > height / 2 + 150 && mouseY < height / 2 + 250) {
      getSettings = true;
      gameOver = false;
      ball.reset();
    }
  }
  else {
    noStroke();
    fill(255, 255, 255);
    rect(0, 0, width, height);
    fill(150, 150, 150);
    rect(0, 0, side, height);
    fill(100, 100, 100);
    rect(int(paddle.location.x), int(paddle.location.y), 10, playerHeight);
    fill(0, 0, 0);
    textSize(30);
    text(ball.hits, width / 2, 50);
    ellipse(int(ball.location.x), int(ball.location.y), ballWidth, ballHeight);
    ball.update(side + ballWidth / 2, paddle, ballHeight / 2, height - ballHeight / 2);
    paddle.update(height - playerHeight);
    if (ball.location.x > width + 50) {
      gameOver = true;
    }
  }
}