let angle = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(255, 0, 0);
  translate(width / 2, height / 2);
  rotate(angle);
  rectMode(CENTER);
  fill(255);
  rect(0, 0, 200, 200);
  angle += 0.02;
}
