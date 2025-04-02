let gridCols = 1;
let gridRows = 1;
let cellWidth, cellHeight;
let grids = [];
let margin;
let ruleSets;
let ruleIndex = 0;
let lastRuleChangeTime = 0;
let pixelSize = 4;


let font, devanagariFont;
function preload() {
  font = loadFont('AnekLatin_Condensed-ExtraBold.ttf')
  devanagariFont = loadFont('AnekDevanagari_Condensed-ExtraBold.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight)
  // createCanvas(1080, 1920);
  // createCanvas(1080/2, 1920/2);
  background('rgba(255,255,0)');

  
  margin = min(width, height) / 4;
  cellWidth = (width - 2 * margin) / gridCols;
  cellHeight = (height - 2 * margin) / gridRows;
  
  let cols = floor((width - 2 * margin) / pixelSize);
  let rows = floor((height - 2 * margin) / pixelSize);

  ruleSets = [
    // [1, 0, 0, 0, 1, 0, 1, 1, 1], // Pattern 1
    [1, 1, 0, 0, 1, 0, 1, 1, 1], // Pattern 2
    [1, 0, 0, 0, 0, 1, 1, 1, 1], // Pattern 3
    [1, 0, 0, 1, 1, 1, 0, 1, 1]  // Pattern 4
  ];
  
  for (let i = 0; i < gridCols; i++) {
    grids[i] = [];
    for (let j = 0; j < gridRows; j++) {
      grids[i][j] = new CellularAutomaton(i, j, ruleSets[ruleIndex]);
    }
  }
  frameRate(30);
}

function draw() {
  background('rgba(255,255,0,30)');
  // scale(0.5)
  for (let i = 0; i < gridCols; i++) {
    for (let j = 0; j < gridRows; j++) {
      grids[i][j].update();
      grids[i][j].display();
    }
  }

  fill(0);
  textSize(min(width, height) / 15);
  
  push()
  textFont(font);
  textAlign(LEFT, BOTTOM);
  text("QUARK", margin, margin);
  pop()
  
  push()
  textFont(devanagariFont);
  textAlign(RIGHT, TOP);
  text("क़ालीन", width - margin, height - margin);
  pop()

  
//   if (millis() - lastRuleChangeTime > 15000) {
//     ruleIndex = (ruleIndex + 1) % ruleSets.length;
//     lastRuleChangeTime = millis();
    
//     for (let i = 0; i < gridCols; i++) {
//       for (let j = 0; j < gridRows; j++) {
//         grids[i][j] = new CellularAutomaton(i, j, ruleSets[ruleIndex]);
//       }
//     }
//   }
  
  
  
    if (frameCount % (30 * 15) === 0) {
    ruleIndex = (ruleIndex + 1) % ruleSets.length;
    
    for (let i = 0; i < gridCols; i++) {
      for (let j = 0; j < gridRows; j++) {
        grids[i][j] = new CellularAutomaton(i, j, ruleSets[ruleIndex]);
      }
    }
  }

  
  
  // //continues where previous rule left off
  // if (frameCount % (30 * 10) === 0) {
  //   ruleIndex = (ruleIndex + 1) % ruleSets.length;
  //   for (let i = 0; i < gridCols; i++) {
  //     for (let j = 0; j < gridRows; j++) {
  //       grids[i][j].ruleSet = ruleSets[ruleIndex];
  //     }
  //   }
  // }


    // if(frameCount == 1) saveGif('rug1', 5)
  
  // if (frameCount === 1) {
  //   const capture = P5Capture.getInstance();
  //   capture.start({
  //     framerate: 30,
  //     format: "webm",
  //     duration: 1350,
  //   });
  // }





}

class CellularAutomaton {
  constructor(gridX, gridY, ruleSet) {
    this.cols = floor((width - 2 * margin) / pixelSize);
    this.rows = floor((height - 2 * margin) / pixelSize);
    this.grid = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));

    this.ruleSet = ruleSet;
    this.centerX = floor(this.cols / 2);
    this.centerY = floor(this.rows / 2);
    this.grid[this.centerY][this.centerX] = 1;

    this.x = (width - this.cols * (cellWidth / this.cols)) / 2;
    this.y = (height - this.rows * (cellHeight / this.rows)) / 2;
  }

  update() {
    let newGrid = this.grid.map(row => row.slice());

    for (let y = 1; y < this.rows - 1; y++) {
      for (let x = 1; x < this.cols - 1; x++) {
        let sum = 
          this.grid[y - 1][x - 1] + this.grid[y - 1][x] + this.grid[y - 1][x + 1] +
          this.grid[y][x - 1] + this.grid[y][x + 1] +
          this.grid[y + 1][x - 1] + this.grid[y + 1][x] + this.grid[y + 1][x + 1];
        newGrid[y][x] = this.ruleSet[sum % this.ruleSet.length];
      }
    }
    
    this.grid = newGrid;
  }

  display() {
    let w = cellWidth / this.cols;
    let h = cellHeight / this.rows;

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        let color = this.grid[y][x] * 255;
        fill(color, 80);
        noStroke();
        rect(this.x + x * w, this.y + y * h, w, h);
      }
    }
  }
}