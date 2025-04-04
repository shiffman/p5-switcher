let cols, rows;
let size = 5;
let m = 10; 
let n = 1; 
let threshold = 0.3;
let gridSize = 4; // 4x4 grid

// Define starting and ending values for m and n.
let startM = 1;
let startN = 1;
let targetM = 1;
let targetN = 5;
let easing = 0.01;

let startAnge;
 let endAngle;
let biteSize;

function updateValues() {
  m += (targetM - m) * easing * (frameRate() / 240);
  n += (targetN - n) * easing * (frameRate() / 240);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = width / (size * gridSize);
  rows = height / (size * gridSize);
  pixelDensity(1);
  biteSize = PI / 16;
  startAngle = biteSize * sin(frameCount * 0.1) + biteSize;
  endAngle = TWO_PI - startAngle;
}

function draw() {
  background(220);
  noStroke();
  
  // Calculate interpolation parameter.
  // The period here is 4000ms (4 seconds) for a full oscillation.
  // let t = millis() / 10000; 
  // let amt = (sin(TWO_PI * t) + 1) / 4; // amt oscillates between 0 and 1
  
  // Interpolate m and n values between start and end.
  // m = lerp(startM, endM, amt);
  // n = lerp(startN, endN, amt);
  
  
  updateValues();
  
  // Draw each cell in the 4x4 grid.
  for (let gridX = 0; gridX < gridSize; gridX++) {
    for (let gridY = 0; gridY < gridSize; gridY++) {
      // Determine if we should mirror in x and/or y direction.
      let mirrorX = gridX % 2 === 1;
      let mirrorY = gridY % 2 === 1;
      
      // Draw the Chladni pattern for this grid cell.
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          // Calculate the normalized position within the individual pattern.
          let x = map(i, 0, cols, 0, 1);
          let y = map(j, 0, rows, 0, 1);
          
          // Apply mirroring if needed.
          if (mirrorX) x = 1 - x;
          if (mirrorY) y = 1 - y;
          
          // Calculate the Chladni value and determine fill color.
          let val = chladni(x, y);
          if (abs(val) < threshold) {
            fill("purple");
          } else {
            fill("orange");
          }
          
          // Calculate the position on the canvas.
          let posX = gridX * cols * size + i * size;
          let posY = gridY * rows * size + j * size;
          circle(posX, posY,size);
        }
      }
    }
  }
  
  // Optionally, draw grid lines.
  noStroke();
  strokeWeight(2);
  for (let i = 1; i < gridSize; i++) {
    line(i * width / gridSize, 0, i * width / gridSize, height);
    line(0, i * height / gridSize, width, i * height / gridSize);
  }
  
  // Display current m and n values.
  noStroke();
  fill(0);
  textSize(16);
  //text("m: " + nf(m, 1, 2) + "   n: " + nf(n, 1, 2), 10, height - 20);
}

function chladni(x, y) {
  let L = 1;
  return cos(n * PI * x / L) * cos(m * PI * y / L) - 
         cos(m * PI * x / L) * cos(n * PI * y / L);
}