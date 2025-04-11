let SizeF = 1;

let paths = [];
let debug = false;
let vehicles = [];
let fontSize;
let font;
let pathCol;
let buffer = 100;
let strokeW;

function preload() {
  //font = loadFont("/assets/Inter_18pt-Black.ttf");
  //font = loadFont("/assets/SpaceMono-Bold.ttf");
  font = loadFont("/assets/bashful.ttf");
}

function setup() {
  createCanvas(1080, 1920);
  fontSize = windowWidth/2.2;
  strokeW = windowWidth/150;

  newPaths(); // Generate multiple paths
  
  let totalLength = paths.reduce((sum, p) => sum + p.getLength(), 0);
  let totalVehicles = 80;
  for (let path of paths) {
    let portion = path.getLength() / totalLength;
    let count = floor(portion * totalVehicles);
    for (let i = 0; i < count; i++) {
      newVehicle(random(-buffer, width+buffer), random(-buffer, height+buffer), path);
    }
  }
  pathCol = random(255);
  startGeneratingVehicles();
}

function draw() {
  background(220);
  for (let p of paths) {
    p.display(pathCol);
  }

  for (let v of vehicles) {
    v.applyBehaviors(vehicles, v.assignedPath);
    v.run();
  }
}

function keyPressed() {
  if (key == "d") debug = !debug;
}

function newPaths() {
  let lines = "RO\nAD".split("\n");
  let leading = fontSize * 0.9;
  let letterSpacing = fontSize * 0.2; // You can adjust this!

  let points = collectTextPoints(lines, leading, letterSpacing);
  let [offsetX, offsetY] = getCenteringOffsets(points);

  createPathsFromPoints(points, offsetX, offsetY);
}

function collectTextPoints(lines, leading, letterSpacing) {
  let allPoints = [];
  
  for (let i = 0; i < lines.length; i++) {
    let xCursor = 0;
    for (let char of lines[i]) {
      if (char === " ") {
        xCursor += fontSize * 0.3; // Skip space
        continue;
      }

      let charPoints = font.textToPoints(char, xCursor, i * leading, fontSize, {
        sampleFactor: 0.2
      });

      allPoints = allPoints.concat(charPoints);

      // Estimate character width for spacing (advance width)
      let bounds = font.textBounds(char, xCursor, 0, fontSize);
      xCursor += bounds.w + letterSpacing;
    }
  }

  return allPoints;
}

function getCenteringOffsets(points) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  for (let p of points) {
    minX = min(minX, p.x);
    maxX = max(maxX, p.x);
    minY = min(minY, p.y);
    maxY = max(maxY, p.y);
  }

  let offsetX = width / 2 - (minX + (maxX - minX) / 2);
  let offsetY = height / 2 - (minY + (maxY - minY) / 2);
  return [offsetX, offsetY];
}

function createPathsFromPoints(points, offsetX, offsetY) {
  let currentPath = new Path();
  let threshold = 20;

  for (let i = 0; i < points.length; i++) {
    let pt = points[i];
    let x = pt.x + offsetX;
    let y = pt.y + offsetY;

    if (i > 0) {
      let prev = points[i - 1];
      if (dist(pt.x, pt.y, prev.x, prev.y) > threshold) {
        if (currentPath.points.length > 1) {
          paths.push(currentPath);
        }
        currentPath = new Path();
      }
    }

    currentPath.addPoint(x, y);
    currentPath.color = color(random(360), random(360), 100); // HSB

    if (debug) {
      textSize(5);
      text(i, x, y);
    }
  }

  if (currentPath.points.length > 1) {
    paths.push(currentPath);
  }
}

function newVehicle(x, y, assignedPath) {
  let maxspeed = random(3, 4);
  let maxforce = 0.3;
  let v = new Vehicle(x, y, maxspeed, maxforce);
  v.assignedPath = assignedPath;
  v.color = assignedPath.color;
  vehicles.push(v);
}

function mousePressed() {
  let closePath = findClosestPath(mouseX, mouseY);
  newVehicle(mouseX, mouseY, closePath);
}

function findClosestPath(x, y) {
  let closestPath = null;
  let closestDist = Infinity;

  for (let path of paths) {
    for (let pt of path.points) {
      let d = dist(x, y, pt.x, pt.y);
      if (d < closestDist) {
        closestDist = d;
        closestPath = path;
      }
    }
  }

  return closestPath;
}

function startGeneratingVehicles(interval = 1000) {
  setInterval(() => {
    let [x, y] = randomEdgePosition(buffer);
    let path = findClosestPath(x, y);
    newVehicle(x, y, path);
  }, interval);
}

function randomEdgePosition(buffer) {
  let side = floor(random(4)); // 0 = top, 1 = right, 2 = bottom, 3 = left
  let x, y;

  if (side === 0) { // top
    x = random(-buffer, width + buffer);
    y = -buffer;
  } else if (side === 1) { // right
    x = width + buffer;
    y = random(-buffer, height + buffer);
  } else if (side === 2) { // bottom
    x = random(-buffer, width + buffer);
    y = height + buffer;
  } else { // left
    x = -buffer;
    y = random(-buffer, height + buffer);
  }

  return [x, y];
}