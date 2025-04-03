let faceMesh;
let video;
let faces = [];
let noiseOffset = 0;
let currentPoint = 0;
let drawingSpeed = 1;
let options = {
  maxFaces: 1,
  refineLandmarks: false,
  flipped: false,
};

let trailPoints = [];
const maxTrailLength = 50;
let pg;

class FaceVector extends p5.Vector {
  constructor(x, y, z = 0) {
    super(x, y, z);
  }

  // Add noise to current vector
  addNoise(index) {
    let nx = noise(this.x * 0.01 + noiseOffset, index * 0.1) * 10;
    let ny = noise(this.y * 0.01 + noiseOffset + 1000, index * 0.1) * 10;
    return new FaceVector(this.x + nx, this.y + ny, this.z);
  }

  // Draw random sketch vector from this point
  drawSketchVector(pg, color, alpha) {
    let angle = random(TWO_PI);
    let length = random(5, 15);
    let sketchVec = new FaceVector(cos(angle) * length, sin(angle) * length);

    pg.stroke(color.r, color.g, color.b, alpha);
    pg.strokeWeight(1);
    pg.line(this.x, this.y, this.x + sketchVec.x, this.y + sketchVec.y);
  }
}

function getColorFromPosition(vec) {
  let blue = map(vec.y, 0, height, 100, 255);
  let red = map(vec.x, 0, width, 50, 100);
  return {
    r: red,
    g: 150,
    b: blue,
  };
}

function preload() {
  faceMesh = ml5.faceMesh(options);
}

function setup() {
  createCanvas(windowWidth, windowHeight); // Switch to standard 2D rendering for simplicity
  pg = createGraphics(windowWidth, windowHeight);

  video = createVideo("NOC-FACE.mov");
  //video.size(width, height);
  video.loop();
  video.hide();

  faceMesh.detectStart(video, gotFaces);

  pg.strokeWeight(2);
  pg.noFill();

  // Set initial background to solid black
  //pg.background(0);
}

function gotFaces(results) {
  faces = results;
  if (faces.length > 0) {
    if (currentPoint >= faces[0].keypoints.length) {
      currentPoint = 0;
      trailPoints = [];
    }
  }
}

function draw() {
  // Clear the main canvas
  clear();
  
  pg.resetMatrix();
  
  // Draw points on graphics buffer with semi-transparent overlay
  pg.push();
  pg.fill(0, 20);
  pg.noStroke();
  pg.rect(0, 0, width, height);
  pg.pop();

  if (faces.length > 0) {
    let face = faces[0];
    push();
    let dw = width - video.width;
    let dh = height - video.height;
    console.log(dw,dh);
    pg.translate(dw / 2, dh / 2);

    for (let i = 0; i < face.keypoints.length; i++) {
      if (i < currentPoint) {
        // Create vector from keypoint
        let pointVec = new FaceVector(face.keypoints[i].x, face.keypoints[i].y);
        let finalVec = pointVec.addNoise(i);

        // Draw point
        pg.push();
        pg.noFill();
        pg.strokeWeight(2);
        pg.stroke(200, 200, 255, 255);
        pg.point(finalVec.x, finalVec.y);
        pg.pop();

        // Draw connection to next point
        if (i < currentPoint - 1) {
          let nextPointVec = new FaceVector(
            face.keypoints[i + 1].x,
            face.keypoints[i + 1].y
          );
          let nextFinalVec = nextPointVec.addNoise(i + 1);

          // Calculate midpoint vector
          let midVec = p5.Vector.lerp(finalVec, nextFinalVec, 0.5);
          let lineColor = getColorFromPosition(midVec);

          pg.push();
          pg.strokeWeight(2);
          pg.stroke(lineColor.r, lineColor.g, lineColor.b, 100);
          pg.line(finalVec.x, finalVec.y, nextFinalVec.x, nextFinalVec.y);
          pg.pop();
        }

        // Draw random sketch vectors
        if (random() < 0.1) {
          let sketchColor = getColorFromPosition(finalVec);
          pg.push();
          finalVec.drawSketchVector(pg, sketchColor, 50);
          pg.pop();
        }
      }
    }

    // Draw trail for current point
    if (currentPoint < face.keypoints.length) {
      let currentVec = new FaceVector(
        face.keypoints[currentPoint].x,
        face.keypoints[currentPoint].y
      );
      let finalCurrentVec = currentVec.addNoise(currentPoint);

      trailPoints.push(finalCurrentVec);

      if (trailPoints.length > maxTrailLength) {
        trailPoints.shift();
      }

      pg.push();
      for (let i = 1; i < trailPoints.length; i++) {
        let alpha = map(i, 0, trailPoints.length, 30, 100);
        let trailColor = getColorFromPosition(trailPoints[i]);

        pg.stroke(200, trailColor.g, trailColor.b, alpha);
        pg.strokeWeight(1);

        let prevVec = trailPoints[i - 1];
        let currentVec = trailPoints[i];
        pg.line(prevVec.x, prevVec.y, currentVec.x, currentVec.y);
      }
      pg.pop();
    }

    currentPoint = min(currentPoint + drawingSpeed, face.keypoints.length);
    noiseOffset += 0.001;
    pop();
  }

  // Draw the graphics buffer to the screen using image() instead of texture+plane
  image(pg, 0, 0);

  // Debug - show a message if face is detected
  if (faces.length > 0) {
    fill(255);
    noStroke();
    //text("Face detected: " + faces[0].keypoints.length + " keypoints", 10, 20);
  }
}
