let angle = 0;
let angle2;
let r = 0;
let r2 = 0;
let balls = [];
let balls2 = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  angle2 = PI;
}

function draw() {
  background(0, 30);
  let thresholds = 0.01;

  // First Ball (Top Left)
  push();
  translate(randomGaussian(width / 4, 2), randomGaussian(height / 4, 2));
  let x = r * cos(angle);
  let y = r * sin(angle);
  let point1 = createVector(x, y);

  if (abs(sin(angle)) < thresholds || abs(cos(angle)) < thresholds) {
    stroke(255);
    strokeWeight(8);
    point(point1.x, point1.y);

    strokeWeight(0.5);
    line(point1.x, -300, point1.x, 400);
    line(-width / 4, point1.y, 400, point1.y);
  } else {
    strokeWeight(1);
  }

  balls.push(point1);

  stroke(255);
  strokeWeight(1);
  for (let i = 0; i < balls.length; i++) {
    point(balls[i].x, balls[i].y);
  }

  pop();

  // Second Ball (Bottom Right)
  push();
  translate(randomGaussian((width * 3) / 4, 1.5), randomGaussian((height * 3) / 4, 1.5));
  let x1 = r2 * cos(angle2);
  let y1 = r2 * sin(angle2);
  let point2 = createVector(x1, y1);

  if (abs(sin(angle2)) < thresholds || abs(cos(angle2)) < thresholds) {
    stroke(255);
    strokeWeight(8);
    point(point2.x, point2.y);

    strokeWeight(0.5);
    line(point2.x, -300, point2.x, height / 4);
    line(-300, point2.y, width / 4, point2.y);
  } else {
    strokeWeight(1);
  }

  balls2.push(point2);

  stroke(255);
  strokeWeight(1);
  for (let i = 0; i < balls2.length; i++) {
    point(balls2[i].x, balls2[i].y);
  }

  pop();

  angle += PI / 40;
  angle2 -= PI / 40;
  r += 0.05;
  r2 += 0.1;
}
