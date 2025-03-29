let circles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 20; i++) {
    circles.push({
      x: random(width),
      y: random(height),
      size: random(20, 80),
      speedX: random(-2, 2),
      speedY: random(-2, 2),
    });
  }
}

function draw() {
  background(0, 255, 0);

  for (let circle of circles) {
    circle.x += circle.speedX;
    circle.y += circle.speedY;

    if (circle.x < 0 || circle.x > width) circle.speedX *= -1;
    if (circle.y < 0 || circle.y > height) circle.speedY *= -1;

    fill(0, 100, 255);
    ellipse(circle.x, circle.y, circle.size);
  }
}
