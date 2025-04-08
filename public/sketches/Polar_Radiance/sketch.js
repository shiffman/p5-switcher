let boids = [];
let isDrawing = false;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);

  reset();
}

function draw() {
  background(0, 4);
  for (let boid of boids) {
    boid.flock(boids);
    boid.update();
    moveOver(boid);
  }

  // if (frameCount % 200 == 0) {
  //   reset();
  // }
}

function moveOver(b) {
  if (b.position.x > width) b.position.x -= width;
  if (b.position.x < 0) b.position.x += width;
  if (b.position.y > height) b.position.y -= height;
  if (b.position.y < 0) b.position.y += height;
}

function reset() {
  isDrawing = true;
  for (let i = 0; i < 200; i++) {
    boids.push(new Boid(random(width), random(height), Math.min(width / 800, 1)));
  }

  // setTimeout(() => {
  //   boids = [];
  //   isDrawing = false;
  // }, 2500);

  background(15);
}

function keyPressed() {
  if (keyCode == 83) {
    saveCanvas('polar_radiance.png');
  } else if (keyCode == 32 && !isDrawing) {
    reset();
  }
}
