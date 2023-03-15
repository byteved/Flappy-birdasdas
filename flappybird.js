// Define the game canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 480;
canvas.height = 320;
document.body.appendChild(canvas);

// Define the bird object
var bird = {
  x: 50,
  y: canvas.height / 2,
  radius: 20,
  velocity: 0,
  gravity: 0.5,
  lift: -10,
  draw: function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.closePath();
  },
  flap: function() {
    this.velocity += this.lift;
  },
  update: function() {
    this.velocity += this.gravity;
    this.y += this.velocity;
    if (this.y + this.radius >= canvas.height) {
      this.y = canvas.height - this.radius;
      this.velocity = 0;
    }
  }
};

// Define the pipes object
var pipes = {
  pipeList: [],
  gap: 100,
  speed: 2,
  spawn: function() {
    var pipeHeight = Math.floor(Math.random() * (canvas.height - this.gap));
    var pipe = {
      x: canvas.width,
      y: 0,
      width: 50,
      height: pipeHeight,
      passed: false
    };
    this.pipeList.push(pipe);
    pipe = {
      x: canvas.width,
      y: pipeHeight + this.gap,
      width: 50,
      height: canvas.height - pipeHeight - this.gap,
      passed: false
    };
    this.pipeList.push(pipe);
  },
  draw: function() {
    for (var i = 0; i < this.pipeList.length; i++) {
      var pipe = this.pipeList[i];
      ctx.beginPath();
      ctx.rect(pipe.x, pipe.y, pipe.width, pipe.height);
      ctx.fillStyle = "green";
      ctx.fill();
      ctx.closePath();
    }
  },
  update: function() {
    for (var i = 0; i < this.pipeList.length; i++) {
      var pipe = this.pipeList[i];
      pipe.x -= this.speed;
      if (pipe.x + pipe.width < bird.x && !pipe.passed) {
        pipe.passed = true;
      }
      if (pipe.x + pipe.width < 0) {
        this.pipeList.splice(i, 1);
        i--;
      }
    }
  }
};

// Define the game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bird.draw();
  bird.update();
  pipes.draw();
  pipes.update();
  if (frames % 100 === 0) {
    pipes.spawn();
  }
  frames++;
  requestAnimationFrame(gameLoop);
}

// Set up the game
var frames = 0;
document.addEventListener("keydown", function(event) {
  if (event.keyCode === 32) {
    bird.flap();
  }
});
requestAnimationFrame(gameLoop);