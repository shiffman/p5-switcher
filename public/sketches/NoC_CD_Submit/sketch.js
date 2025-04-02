let particles = [], numParticles = 600;
let state, stateStart, center;
const assembleDuration = 3000, spinDuration = 2000, dismantleDuration = 3000;
let baseColor, altColor;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  center = createVector(0, -50, 0);
  for (let i = 0; i < numParticles; i++) {
    let startPos = createVector(random(-width/2+50, width/2-50), 200, random(-200,200));
    particles.push(new Particle(startPos, i));
  }
  state = "assemble"; 
  stateStart = millis();
  baseColor = color(255, 150, 50);
  altColor = color(50, 150, 255);
}

function draw() {
  background(20);
  orbitControl();
  
  // Enhanced lighting for a more clear 3D type of effect
  ambientLight(80);
  directionalLight(255, 255, 255, 0, -1, 0);
  pointLight(255, 200, 200, 0, -100, 200);
  
  // Extra scene rotation for dramatic flair
  rotateY(frameCount * 0.005);
  rotateX(frameCount * 0.002);
  
  // This code creates a base 
  push();
    noStroke();
    fill(80);
    translate(0, 200, 0);
    rotateX(HALF_PI);
    rectMode(CENTER);
    rect(0, 0, width, width);
  pop();
  
  let t = millis(), dt = t - stateStart;
  
  if (state === "assemble") {
    particles.forEach(p => p.target = getDynamicTarget(p.index, t));
    if (dt > assembleDuration) { state = "spin"; stateStart = t; }
  } else if (state === "spin") {
    // I updated the code to give it three rotations now
    let spinAngle = lerp(0, TWO_PI * 3, dt / spinDuration);
    particles.forEach(p => {
      let dynamicTarget = getDynamicTarget(p.index, t);
      let rel = p5.Vector.sub(dynamicTarget, center);
      p.target = p5.Vector.add(center, rotateYVector(rel, spinAngle));
    });
    if (dt > spinDuration) {
      state = "dismantle"; stateStart = t;
      particles.forEach(p => p.floorTarget = createVector(random(-width/2+50, width/2-50), 200, random(-200,200)));
    }
  } else if (state === "dismantle") {
    particles.forEach(p => {
      let targetCopy = p.floorTarget.copy();
      if (p.pos.y >= 200) targetCopy.y = p.pos.y;
      p.target = targetCopy;
    });
    if (dt > dismantleDuration) {
      state = "assemble"; stateStart = t;
      particles.forEach(p => p.floorTarget = null);
    }
  }
  
  particles.forEach(p => { p.update(); p.display(); });
}

// Helper: rotates vector 'v' about the Y-axis by angle 'a'
function rotateYVector(v, a) {
  return createVector(v.x * cos(a) - v.z * sin(a), v.y, v.x * sin(a) + v.z * cos(a));
}

// I used an LLM for this, this computes a dynamic target for each particle with larger pulsations and vertical oscillation
function getDynamicTarget(idx, t) {
  let theta = map(idx, 0, numParticles - 1, 0, TWO_PI * 2);
  let baseR = 150;
  let pulsate = 30 * sin(t * 0.005 + idx);
  let r = baseR + pulsate;
  let x = r * cos(theta);
  let z = r * sin(theta);
  let y = map(idx, 0, numParticles - 1, -150, 150) + 30 * sin(t * 0.003 + theta);
  return createVector(x, y, z).add(center);
}

class Particle {
  constructor(pos, idx) {
    this.pos = pos.copy();
    this.vel = createVector();
    this.target = createVector();
    this.index = idx;
    this.floorTarget = null;
  }
  
  update() {
    let desired = p5.Vector.sub(this.target, this.pos).mult(0.1);
    this.vel.add(desired);
    this.vel.mult(0.9);
    this.pos.add(this.vel);
    // Bounce off the floor (y = 200)
    if (this.pos.y > 200) {
      this.pos.y = 200;
      this.vel.y *= -0.7;
    }
  }
  
  display() {
    push();
      // Draws a shadow for depth
      let shadowScale = map(this.pos.y, -150, 200, 0.5, 1.5);
      let shadowAlpha = map(this.pos.y, -150, 200, 50, 150);
      push();
        translate(this.pos.x, 200, this.pos.z);
        noStroke();
        fill(0, shadowAlpha);
        ellipse(0, 0, shadowScale * 6, shadowScale * 3);
      pop();
      
      // Draws the particle as a tiny sphere with dynamic color
      translate(this.pos.x, this.pos.y, this.pos.z);
      noStroke();
      let lerpAmt = (sin(frameCount * 0.005 + this.index) + 1) / 2;
      let col = lerpColor(baseColor, altColor, lerpAmt);
      ambientMaterial(col);
      sphere(2);
    pop();
  }
}
