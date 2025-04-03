//JESSIE ZHAI
//NOC FORCES

let stars = [];
let speedMax = 2;
let speedMin = 5;
let end = 3200;
let start = -3200;
let speed;
let moon;
let gravitySlider;
let G = 5;
let textCanvas;


const GRAVITY_CONSTANTS = {
  mercury: 370,
  venus: 110,
  earth: 590,
  mars: 250,
  jupiter: 40,
  saturn: 15,
  uranus: 4.2,
  neptune: 2.3
};


const GRAVITY_SCALE = 0.001;

function preload() {
  sunTexture = loadImage("sun.jpg");
  earth = loadImage("earth.jpg");
  mercury = loadImage("mercury.jpg");
  venus = loadImage("venus.jpg");
  mars = loadImage("mars.jpg");
  jupiter = loadImage("jupitermap.jpg");
  saturn = loadImage("saturn.jpg");
  uranus = loadImage("uranus.jpg");
  neptune = loadImage("neptune.jpg");
  moon = loadImage("moon.jpg");
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  
  textCanvas = createGraphics(width, height);
  textCanvas.position(0, 0);
  textCanvas.style('pointer-events', 'none');
  

  gravitySlider = createSlider(0.1, 10, 0.1, 0.1);
  gravitySlider.position(10, height + 10);
  gravitySlider.style('width', '200px');
  
  let gravityText = createDiv('Gravity: ' + gravitySlider.value());
  gravityText.position(220, height + 10);
  gravityText.style('color', 'black');

  sun = new Sun(0, 0, 3330000);


  planets = [
    new Planet(0, 0, 100, earth, 300, 15, 0.2, GRAVITY_CONSTANTS.earth),
    new Planet(0, 0, 50, mercury, 117, 4.5, 0.3, GRAVITY_CONSTANTS.mercury),
    new Planet(0, 0, 80, venus, 216, 13.5, 0.2, GRAVITY_CONSTANTS.venus),
    new Planet(0, 0, 10, mars, 456, 7.5, 0.16, GRAVITY_CONSTANTS.mars),
    new Planet(0, 0, 31700, jupiter, 1560, 168, 0.08, GRAVITY_CONSTANTS.jupiter),
    new Planet(0, 0, 9500, saturn, 2862, 141, 0.06, GRAVITY_CONSTANTS.saturn),
    new Planet(0, 0, 1450, uranus, 5760, 60, 0.04, GRAVITY_CONSTANTS.uranus),
    new Planet(0, 0, 1710, neptune, 9000, 58, 0.03, GRAVITY_CONSTANTS.neptune),
  ];

  moon = new Moon(1.2, 3, 0.7, 0.5, moon);

  angleMode(DEGREES);
  for (let i = 0; i < 800; i++) {
    stars.push({
      xPos: random(-2 * width, 2 * width),
      yPos: random(-2 * height, 2 * height),
      zPos: random(-3200, 3200),
      size: random(0.3, 3),
    });
  }
}

function draw() {
  background(0);
  orbitControl();
  

  G = gravitySlider.value();

  select('div').html('Gravity: ' + G);

  textCanvas.clear();
  
  textCanvas.fill(255);
  textCanvas.noStroke();
  textCanvas.textAlign(LEFT, TOP);
  textCanvas.textFont('Courier New');
  textCanvas.textSize(12);
  let yOffset = 10;
  
  let planetNames = ['Earth', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
  planets.forEach((planet, i) => {
    let coords = planet.orbit ? 
      `(${planet.orbit.x.toFixed(1)}, ${planet.orbit.y.toFixed(1)})` : 
      '(0, 0)';
    textCanvas.text(`${planetNames[i]}: ${coords}`, 10, yOffset + i * 15);
  });

  stroke(random(230, 255));
  speed = map(0, 0, 1, speedMin, speedMax);

  for (let star of stars) {
    strokeWeight(ceil(map(star.zPos, start, end, 0, star.size)));
    point(star.xPos, star.yPos, star.zPos);
    star.zPos += speed;
    if (star.zPos > end) {
      star.xPos = random(-2 * width, 2 * width);
      star.yPos = random(-2 * height, 2 * height);
      star.size = random(0.3, 3);
      star.zPos = start;
    }
  }

  for (let planet of planets) {
    sun.attract(planet);
    planet.update();
    planet.show();
    
    if (planet === planets[0]) {
      moon.update(planet);
      moon.show(planet);
    }
  }

  sun.update();
  sun.show();
  
  push();
  translate(-width/2, -height/2, 0);
  image(textCanvas, 0, 0);
  pop();
}

class Sun {
  constructor(x, y, m) {
    this.pos = createVector(x, y);
    this.mass = m;
    this.r = sqrt(this.mass) * 2;
    this.rotationAngle = 0;
    this.rotationSpeed = 0.1; 
  }

  update() {
    this.rotationAngle += this.rotationSpeed;
    if (this.rotationAngle >= 360) {
      this.rotationAngle = 0;
    }
  }

  attract(mover) {
    let force = p5.Vector.sub(this.pos, mover.pos);
    let distanceSq = constrain(force.magSq(), 100, 1000);

    let strength = (G * GRAVITY_SCALE * mover.gravityConstant * (this.mass * mover.mass)) / distanceSq;
    force.setMag(strength);
    mover.applyForce(force);
  }

  show() {
    push();
    rotateY(this.rotationAngle);
    normalMaterial();
    texture(sunTexture);
    sphere(109);
    pop();
  }
}

class Planet {
  constructor(x, y, m, planetTexture, distance, size, speed, gravityConstant) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random3D();
    this.vel.mult(5);
    this.acc = createVector(0, 0);
    this.mass = m;
    this.r = sqrt(this.mass) * 2;
    this.texture = planetTexture;
    this.baseDistance = distance; 
    this.size = size;
    this.speed = speed;
    this.angle = 0;
    this.orbit = createVector(distance, 0);
    this.gravityConstant = gravityConstant;
  }

  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acc.add(f);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
    this.angle += this.speed;
    

    let gravityEffect = 1 / (G * GRAVITY_SCALE * this.gravityConstant + 1);
    let currentDistance = this.baseDistance * gravityEffect;
    
    this.orbit = createVector(currentDistance, 0).rotate(this.angle);
  }

  show() {
    normalMaterial();
    texture(this.texture);
    push();
    translate(this.orbit.x, this.orbit.y, 0);
    sphere(this.size);
    pop();
  }
}

class Moon {
  constructor(mass, size, distance, speed, mtext) {
    this.mass = mass;
    this.r = sqrt(this.mass) * 2;
    this.texture = mtext;
    this.distance = distance;
    this.size = size;
    this.speed = speed;
    this.angle = 0;
  }

  update(planet) {
    this.angle += this.speed;
  }

  show(planet) {
    push();
    translate(planet.orbit.x, planet.orbit.y, 0);
    let orbitDistance = this.distance * planet.size + planet.size;
    let moonOrbit = createVector(orbitDistance, 0).rotate(this.angle);
    translate(moonOrbit.x, moonOrbit.y, 0);
    normalMaterial();
    texture(this.texture);
    sphere(this.size);
    pop();
  }
}