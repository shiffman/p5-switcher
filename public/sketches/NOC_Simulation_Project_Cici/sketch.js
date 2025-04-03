let fishImg, target;
let fishes = [];
let img1,img2,img3;
let jellyfishGroup = [];
let numJellyfish = 25; 
let flock;
let waves = []; 
let numWaves = 10; 
let wbubbles = [];

function preload() {
  fishImg = loadImage("fish.png");
  img1 = loadImage("worm.png");
  img3 = loadImage("fish2.png");
}

function setup() {
  pixelDensity(1);
  noSmooth();
  flock = new Flock();
  
  for (let i = 0; i < numWaves; i++) {
    waves.push(new Wave(random(20, 100), random(0.01, 0.03), random(50, 200)));
  }
  for (let i = 0; i < 200; i++) {
    wbubbles.push(new wavebubble(random(width), random(height / 2, height)));
  }
  
  // Add an initial set of boids into the system
  for (let i = 0; i < 200; i++) {
    let boid = new Boid(width / 2, height / 2);
    flock.addBoid(boid);
  }
  // Add the wave
  createCanvas(windowWidth,windowHeight);
  target = new Target(random(width), random(height));
  // Add the fish
  while (fishes.length < 10) {
    fishes.push(new Fish(fishImg));
  }

  // Add the jellyfish
    for (let i = 0; i < numJellyfish; i++) {
    let x = width / (numJellyfish + 1) * (i + 1); 
    let y = random(0,height);
    jellyfishGroup.push(new Jellyfish(x, y, i * 0.5)); 
  }
      for (let i = 0; i < numJellyfish; i++) {
    let x = width / (numJellyfish + 1) * (i + 1); 
    let y = random(0,height);
    jellyfishGroup.push(new Jellyfish(x, y, i * 0.5)); 
  }
}

function draw() {
  background(5,0,0,80);
  
  for (let wave of waves) {
    
    wave.display();
    wave = new Wave(4000, 1, height / 2); 
    wave = new Wave(2000, 0.1, height / 2); 
    
  }


  for (let wavebubble of wbubbles) {
    wavebubble.display();
    wavebubble.move();
  }

  
  flock.run();
  target.update();
  target.show();
  
  
  for (let jellyfish of jellyfishGroup) {
    jellyfish.update();
    jellyfish.display();
  }

  for (let fish of fishes) {
    fish.update();
    fish.show();
  }
}
function mouseDragged() {
  flock.addBoid(new Boid(mouseX, mouseY));
}


function drawFish(x, y, w, h, tailLength){
  push();
  translate(x, y);
  image(img3,0,0,30,20);
  
  pop();
}
