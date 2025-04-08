let bodies = [];
let trailLength = 200;
let trailSet = 0;
let slider_b1, slider_b2, slider_b3;
let cameraMode = 1;
let toggleButton;

class Body {
  constructor(x, y, mass, color) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(2);
    this.acc = createVector(0, 0);
    this.mass = mass;
    this.color = color;
    this.trail = [];
  }

  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acc.add(f);
  }

  attract(other) {
    let force = p5.Vector.sub(this.pos, other.pos);
    let distance = constrain(force.mag(), 20, 500);
    let G = 50;
    let strength = (G * this.mass * other.mass) / (distance * distance);
    force.setMag(strength);
    return force;
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    if (trailSet !== 2) {
      this.trail.push({ pos: this.pos.copy(), alpha: 255 });

      if (trailSet === 0 && this.trail.length > trailLength) {
        this.trail.shift();
      }
    }
  }

  show() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.mass * 2);

    if (trailSet !== 2) {
      noFill();
      beginShape();
      for (let i = 0; i < this.trail.length; i++) {
        let t = this.trail[i];

        if (trailSet === 0) {
          stroke(255, 255, 255, t.alpha);
          strokeWeight(2);
          point(t.pos.x, t.pos.y);
          t.alpha -= 1.5;
          t.alpha = max(t.alpha, 0);
        } else if (trailSet === 1) {
          stroke(255);
          strokeWeight(1.5);
          vertex(t.pos.x, t.pos.y);
        }
      }
      endShape();
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  resetSimulation();

  // slider_b1 = createSlider(1, 51, 30, 5);
  // slider_b1.position(10, 10);
  // slider_b1.size(100);

  // slider_b2 = createSlider(1, 51, 20, 5);
  // slider_b2.position(10, 40);
  // slider_b2.size(100);

  // slider_b3 = createSlider(1, 51, 15, 5);
  // slider_b3.position(10, 70);
  // slider_b3.size(100);

  // toggleButton = createButton("Toggle Camera");
  // toggleButton.position(10, 100);
  // toggleButton.mousePressed(toggleCamera);
}

function draw() {
  background(0);
  Camera();

  if (bodies.length >= 3) {
    bodies[0].mass = 75; //slider_b1.value();
    bodies[1].mass = 10; //slider_b2.value();
    bodies[2].mass = 15; //slider_b3.value();
  }

  let targetBody = bodies[0];
  if (cameraMode >= 1 && cameraMode <= bodies.length) {
    targetBody = bodies[cameraMode - 1];
  }

  drawGrid();

  for (let i = 0; i < bodies.length; i++) {
    for (let j = 0; j < bodies.length; j++) {
      if (i !== j) {
        let force = bodies[i].attract(bodies[j]);
        bodies[j].applyForce(force);
      }
    }
  }

  for (let body of bodies) {
    body.update();
    body.show();
  }

  push();
  resetMatrix();

  fill('white');
  textSize(15);
  noStroke();
  // text(bodies[0].mass - 1, slider_b1.x + slider_b1.width + 10, slider_b1.y + 10);
  // text(bodies[1].mass - 1, slider_b2.x + slider_b2.width + 10, slider_b2.y + 10);
  // text(bodies[2].mass - 1, slider_b3.x + slider_b3.width + 10, slider_b3.y + 10);

  textAlign(CENTER);
  fill(255, 255, 255, 100);
  //text('Press [R] to Restart, [L] to Toggle Trail, [C] to Toggle Camera', width / 2, height - 50);
  pop();
}

function Camera() {
  if (cameraMode >= 1 && cameraMode <= 3) {
    let targetBody = bodies[cameraMode - 1];
    translate(width / 2 - targetBody.pos.x, height / 2 - targetBody.pos.y);
  } else {
    translate(0, 0); // Original view (no shift)
  }
}

function toggleCamera() {
  cameraMode = (cameraMode + 1) % 4;
}

function drawGrid() {
  stroke(255, 255, 255, 25);
  strokeWeight(0.7);
  let spacing = 50;

  for (let x = 0; x < 100000; x += spacing) {
    line(x - 50000, -50000, x - 50000, 50000);
  }

  for (let y = 0; y < 100000; y += spacing) {
    line(-50000, y - 50000, 50000, y - 50000);
  }
}

function keyPressed() {
  if (key === 'R' || key === 'r') {
    resetSimulation();
  }
  if (key === 'L' || key === 'l') {
    trailSet = (trailSet + 1) % 3;
  }
  if (key === 'C' || key === 'c') {
    toggleCamera();
  }
}

function resetSimulation() {
  bodies = [];
  bodies.push(new Body(width / 2 - 150, height / 2, 30, 'rgb(255,255,255)'));
  bodies.push(new Body(width / 2 + 150, height / 2, 20, 'rgb(255,255,255)'));
  bodies.push(new Body(width / 2, height / 2 - 150, 10, 'rgb(255,255,255)'));
}
