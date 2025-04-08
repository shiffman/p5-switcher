// SLIME MOLD!
// if cursor moves close to a patch of molds, they will diffuse!

//variables 
let molds = []; //array to hold all the mold objects
let num = 5000; //number of molds
let d; // Holds the pixel density of the display

//
function setup() {
  createCanvas(windowWidth, windowHeight); //pattern appear as fit user window width and height 
  angleMode(DEGREES); // Sets angle mode to degrees
  d = pixelDensity(); // Gets the pixel density of the screen

// Create and store 5000 Mold objects
  for (let i = 0; i < num; i++) {
    molds[i] = new Mold(); // Each mold object is stored in the molds array

  }
}

function draw() {
  background(0, 5);
  loadPixels(); // Prepares pixel manipulation

  for (let i = 0; i < num; i++) {
    molds[i].update(); // Update mold position and behavior
    molds[i].display(); // Display mold with current color palette
  }
}
