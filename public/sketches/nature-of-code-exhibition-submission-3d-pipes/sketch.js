const maxPipesNum = 6;
let pipes = [];
let stepSize = 0;
let direction = 0;
let x = 0;
let y = 0;
let z = 0;
let pdirection = 0;
let pipeThickness = 0.02;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB);
  pipes.push({
    color: color(random(360), 60, 100),
    vertices: [createVector(x, y, z)],
  });
  noStroke();
  perspective(2 * atan(height / 2 / 400));
  randomSeed(0);
}

function draw() {
  orbitControl();
  lights();
  directionalLight(255, 0, 0, createVector(1, 1, 1));
  const scaleFactor = min(width, height) * 0.5;
  background(0);
  rotateY(frameCount / 1000);
  newPipe();
  for (const pipe of pipes) {
    fill(pipe.color);
    const vertices = pipe.vertices;
    for (let i = 0; i < vertices.length - 2; i++) {
      push();
      const v1 = vertices[i].copy().mult(scaleFactor);
      const v2 = vertices[i + 1].copy().mult(scaleFactor);
      const pipeVector = v2.copy().sub(v1);
      const v = v1.copy().add(pipeVector.copy().mult(0.5));
      translate(v.x, v.y, v.z);
      const zRotation = p5.Vector.angleBetween(
        createVector(0, 1, 0),
        createVector(pipeVector.x, pipeVector.y, 0)
      );
      const xRotation = p5.Vector.angleBetween(
        createVector(0, 1, 0),
        createVector(0, pipeVector.y, pipeVector.z)
      );
      rotateZ(zRotation ? zRotation : 0);
      rotateX(xRotation ? xRotation : 0);
      cylinder(scaleFactor * pipeThickness, pipeVector.mag());
      pop();
      push();
      translate(v1.x, v1.y, v1.z);
      sphere(scaleFactor * pipeThickness);
      pop();
    }
  }
}

function newPipe() {
  stepSize = random(0.2, 0.5);
  direction = floor(direction + random(1, 6)) % 6;
  let moveX = 0;
  let moveY = 0;
  let moveZ = 0;
  switch (direction) {
    case 0:
      moveX = stepSize;
      break;
    case 1:
      moveX = -stepSize;
      break;
    case 2:
      moveY = stepSize;
      break;
    case 3:
      moveY = -stepSize;
      break;
    case 4:
      moveZ = stepSize;
      break;
    case 5:
      moveZ = -stepSize;
      break;
  }
  x += moveX;
  y += moveY;
  z += moveZ;
  pipes[pipes.length - 1].vertices.push(createVector(x, y, z));
  pdirection = direction;
  if (x > 4 || x < -4 || y > 4 || y < -4 || z < -4 || z > 4) {
    if (pipes.length > maxPipesNum) pipes = [];
    pipes.push({ color: color(random(360), 60, 100), vertices: [] });
    x = random(-0.5, 0.5);
    y = random(-0.5, 0.5);
    z = random(-0.5, 0.5);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
