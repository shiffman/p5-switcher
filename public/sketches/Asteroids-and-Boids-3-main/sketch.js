// ASTEROIDS & BOIDS by fl4me.boi

// Mover object
let asteroid;
let boid;
let numBoids = 30;
let flock;
let numBoidsSlider, boundarySlider, sepSlider, aliSlider, cohSlider;
let dampingSlider, topspeedSlider, maxforceSlider;
let debugCheckbox;
let target; 
let interval;
let showUI = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  asteroid = new Asteroid();

  // Initialize the random target point
  target = createVector(random(width), random(height));

  // Set an interval to update the target point every 3 to 5 seconds
  interval = setInterval(() => {
    target = createVector(random(width), random(height));
  }, random(1000, 2500)); // Random interval between 3 and 5 seconds

  // Boid sliders
  numBoidsSlider = createSlider(0, 500, 200);
  numBoidsSlider.position(10, 10);
  numBoidsSlider.hide(); 
  boundarySlider = createSlider(50, 500, 200);
  boundarySlider.position(10, 40);
  boundarySlider.hide(); 
  sepSlider = createSlider(0, 5, 3, 0.1);
  sepSlider.position(10, 70);
  sepSlider.hide(); 
  aliSlider = createSlider(0, 5, 1.0, 0.1);
  aliSlider.position(10, 100);
  aliSlider.hide(); 
  cohSlider = createSlider(0, 5, 1.0, 0.1);
  cohSlider.position(10, 130);
  cohSlider.hide(); 

  // Asteroid sliders
  dampingSlider = createSlider(0.9, 1, 0.995, 0.001);
  dampingSlider.position(width - 150, 10);
  dampingSlider.hide(); 
  topspeedSlider = createSlider(1, 10, 6);
  topspeedSlider.position(width - 150, 40);
  topspeedSlider.hide();
  maxforceSlider = createSlider(0.01, 1, 0.1, 0.01);
  maxforceSlider.position(width - 150, 70);
  maxforceSlider.hide(); 

  // Debug checkbox
  debugCheckbox = createCheckbox('Debug Visualization', false);
  debugCheckbox.position(10, 160);
  debugCheckbox.style('color', 'white'); // Set the text color to white
  debugCheckbox.hide();

  flock = new Flock();
  // Add an initial set of boids into the system
  for (let i = 0; i < numBoids; i++) {
    let boid = new Boid(width / 2, height / 2);
    flock.addBoid(boid);
  }
}

function draw() {
  background(0, 50);

  let numBoids = numBoidsSlider.value();
  let boundary = boundarySlider.value();
  let sepWeight = sepSlider.value();
  let aliWeight = aliSlider.value();
  let cohWeight = cohSlider.value();

  if (numBoids < flock.boids.length) {
    flock.boids.splice(numBoids, flock.boids.length - numBoids);
  } else if (numBoids > flock.boids.length) {
    for (let i = flock.boids.length; i < numBoids; i++) {
      let boid = new Boid(width / 2, height / 2);
      flock.addBoid(boid);
    }
  }

  flock.run(asteroid, boundary, sepWeight, aliWeight, cohWeight);

  // Update asteroid parameters
  asteroid.damping = dampingSlider.value();
  asteroid.topspeed = topspeedSlider.value();
  asteroid.maxforce = maxforceSlider.value();

  asteroid.arrive(target);

  // Update position
  asteroid.update();
  // Wrap edges
  asteroid.wrapEdges();
  // Draw asteroid
  asteroid.show();

  // Draw debug circle if checkbox is NOT checked
  if (!debugCheckbox.checked()) {
    // Debug circle for asteroid
    push();
    noFill();
    let boundaryColor = map(sin(frameCount * 0.1), -1, 1, 50, 255);
    stroke(boundaryColor, 50, 50);
    ellipse(asteroid.position.x, asteroid.position.y, boundary);
    pop();

    // Bounding box for target visualization
    push();
    noFill();
    stroke(255, 0, 0);
    strokeWeight(1);
    rectMode(CENTER);
    rect(target.x, target.y, 30, 30);
    pop();

    // Debug line connecting the asteroid to the target
    push();
    stroke(255);
    strokeWeight(0.2);
    line(asteroid.position.x, asteroid.position.y, target.x, target.y);
    pop();
  }

  // // Bounding box for target visualization
  // push();
  // noFill();
  // stroke(255, 0, 0);
  // strokeWeight(1);
  // rectMode(CENTER);
  // rect(target.x, target.y, 30, 30);
  // pop();

  // // Draw a debug line connecting the asteroid to the target
  // push();
  // stroke(255);
  // strokeWeight(0.2);
  // line(asteroid.position.x, asteroid.position.y, target.x, target.y);
  // pop();

  // Labels for sliders
  if (showUI) {
    fill(255);
    text("Number of Boids", numBoidsSlider.x * 2 + numBoidsSlider.width, 25);
    text("Boundary", boundarySlider.x * 2 + boundarySlider.width, 55);
    text("Separation", sepSlider.x * 2 + sepSlider.width, 85);
    text("Alignment", aliSlider.x * 2 + aliSlider.width, 115);
    text("Cohesion", cohSlider.x * 2 + cohSlider.width, 145);

    text("Damping", dampingSlider.x - 80, 25);
    text("Top Speed", topspeedSlider.x - 80, 55);
    text("Max Force", maxforceSlider.x - 80, 85);
  }
}

function keyPressed() {
  if (key === ' ') {
    showUI = !showUI; // Toggle UI visibility

    // Show or hide sliders and checkbox based on `showUI`
    if (showUI) {
      numBoidsSlider.show();
      boundarySlider.show();
      sepSlider.show();
      aliSlider.show();
      cohSlider.show();
      dampingSlider.show();
      topspeedSlider.show();
      maxforceSlider.show();
      debugCheckbox.show();
    } else {
      numBoidsSlider.hide();
      boundarySlider.hide();
      sepSlider.hide();
      aliSlider.hide();
      cohSlider.hide();
      dampingSlider.hide();
      topspeedSlider.hide();
      maxforceSlider.hide();
      debugCheckbox.hide();
    }
  }
}