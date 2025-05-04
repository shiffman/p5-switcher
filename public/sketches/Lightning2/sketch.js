//https://editor.p5js.org/JennaDafter/sketches/AOI2xqfhf
var lightning = [];
let scale =2.4;
var offsetX = 50 *scale;
var offsetY = 40*scale;
var length = 250*scale;
var sd = 50*scale;
var gens = 255;
let glowLayer;
let lightLayer;
let depthLeft = 4;
let ogDepth;
let startPoint;
let endPoint;
let dash = 2;
let slash = 4;
let storm;
let back;
let angle;
let glowAlreadyBlurred = false;


function preload() {
  storm = loadImage("12.png");
  back = loadImage("1.webp");
}

function setup() {
  createCanvas( 450 * scale, 800 * scale);

  ogDepth = depthLeft;

  strokeCap(SQUARE);
  lightLayer= createGraphics(width*scale, height*scale);
  lightLayer.clear();
  glowLayer = createGraphics(width*scale, height*scale);
  glowLayer.clear();

  startPoint = createVector(width / 2, 300*scale);
  endPoint = createVector(width / 2 + randomGaussian(0, 100), 700*scale);

  generateLightning(startPoint, endPoint, 4*scale*1.2, depthLeft);
}

function draw() {
  background(30-frameCount % 60, 20);
  image(back, 0, 0, 450*scale, 800*scale);

  if (frameCount % 60 < 40) {
    tint(200-frameCount % 60);
    image(storm, 0, 0, 450*scale, 800*scale);
    
  } else {
    lightning = [];
    glowLayer.clear();
    lightLayer.clear();
  }
  
  if (frameCount % 60 > 30) {
     lightLayer.filter(BLUR, 1);
  }

 

  if (frameCount % 60 < 20) {
    background(250);
    tint(230);
    image(storm, 0, 0, 450*scale, 800*scale);

    filter(POSTERIZE, 10);
  }

  if (frameCount % 60 === 0) {
    offsetX = 30;
    offsetY = 10;
    startPoint = createVector(
      width / 2 + randomGaussian(0, 10),
      random(260, 300)*scale
    );
    endPoint = createVector(
      width / 2 + randomGaussian(0, 50),
      (700 + randomGaussian(0, 20))*scale
    );

    generateLightning(startPoint, endPoint, 4*scale*1.2, depthLeft);
  }
  

  image(glowLayer, 0,0);
  glowLayer.filter(BLUR, 10-frameCount%60);
  
  image(lightLayer, 0,0);
  
    
  if(frameCount % 60 <4){
     background(255,128);
  }
  
 
  

  for (let bolt of lightning) {
    if (bolt && bolt.segments && bolt.segments.length > 0) {
      bolt.show();
      // bolt.showOriginal();
    }
  }
}
function addBreaks(start, end, scaleFactor, points, numSegments, parentDir) {
  let noEnd = false;
  if (!parentDir) parentDir = p5.Vector.sub(end, start).normalize();

  let angleFromVertical = atan2(parentDir.y, parentDir.x) - HALF_PI;
  let sideBias = angleFromVertical < 0 ? 1 : -1;

  let segDir = p5.Vector.sub(end, start).normalize();
  let perp = createVector(-segDir.y, segDir.x); // perpendicular to bolt

  for (let i = 1; i < numSegments; i++) {
    let t = i / numSegments;
    let dirs = [];
    let p = p5.Vector.lerp(start, end, t);

    if (depthLeft === ogDepth) {
      if (i === numSegments - 2 && dash === 2) {
        dirs[i - 1] = "dash";
        dash--;

        let lateral = perp.copy().mult(sideBias * randomGaussian((offsetX * 1.3) / i * scaleFactor));
        let forward = segDir.copy().mult(randomGaussian((offsetY * 1.0) / i * scaleFactor));

        p.add(forward);
        p.add(lateral);

      } else if (i === numSegments - 1 && dirs[i - 2] === "dash") {
        dirs[i - 1] = "slash";
        slash--;

        let lateral = perp.copy().mult(sideBias * randomGaussian((offsetX * 1.0) / i * scaleFactor));
        let forward = segDir.copy().mult(randomGaussian((offsetY * 1.3) / i * scaleFactor));

        p.add(forward);
        p.add(lateral);

      } else if (dash > 0 && random() < 0.3) {
        dirs[i - 1] = "dash";
        dash--;

        let lateral = perp.copy().mult(sideBias * randomGaussian((offsetX * 1.3) / i * scaleFactor));
        let forward = segDir.copy().mult(randomGaussian((offsetY * 1.0) / i * scaleFactor));

        p.add(forward);
        p.add(lateral);

      } else if (slash > 0) {
        dirs[i - 1] = "slash";
        slash--;

        let lateral = perp.copy().mult(sideBias * randomGaussian((offsetX * 1.0) / i * scaleFactor));
        let forward = segDir.copy().mult(randomGaussian((offsetY * 1.3) / i * scaleFactor));

        p.add(forward);
        p.add(lateral);
      }

    } else {
      if (dash === 2 && i === 2) {
        dirs[i - 1] = "dash";
        dash--;

        let lateral = perp.copy().mult(sideBias * randomGaussian((offsetX * 4) / i * scaleFactor));
        let forward = segDir.copy().mult(randomGaussian((offsetY * 2) / i * scaleFactor));

        p.add(forward);
        p.add(lateral);

      } else if (slash === 4 && i === 1) {
        dirs[i - 1] = "slash";
        slash--;

        let lateral = perp.copy().mult(-sideBias * randomGaussian((offsetX * 4) / i * scaleFactor));
        let forward = segDir.copy().mult(randomGaussian((offsetY * 3) / i * scaleFactor));

        p.add(forward);
        p.add(lateral);

      } else if (random() < 0.5 && dash > 0) {
        dirs[i - 1] = "dash";
        dash--;

        let lateral = perp.copy().mult(sideBias * random((offsetX * 2) / i * scaleFactor, (offsetX * 5) / i * scaleFactor));
        let forward = segDir.copy().mult(randomGaussian((offsetY * 1) / i * scaleFactor, (offsetY * 3) / i * scaleFactor));

        p.add(forward);
        p.add(lateral);

      } else if (slash > 0) {
        dirs[i - 1] = "slash";
        slash--;

        let lateral = perp.copy().mult(-sideBias * random((offsetX * 2) / i * scaleFactor, (offsetX * 5) / i * scaleFactor));
        let forward = segDir.copy().mult(randomGaussian((offsetY * 3) / i * scaleFactor, (offsetY * 5) / i * scaleFactor));

        p.add(forward);
        p.add(lateral);
      }

      if (i == numSegments - 1) {
        noEnd = true;
        
        let lateral = perp.copy().mult(sideBias  * random(offsetX * 1 * scaleFactor));
        let forward = segDir.copy().mult(random(offsetY * 2 * scaleFactor));

        p.add(forward);
        p.add(lateral);
      }
    }

    points.push(p);
  }

  if (!noEnd) {
    points.push(end);
  }
}



function generateLightning(start, end, thickness, depthLeft, angle) {
  let numSegments = int(random(3, 6));
  let numS;
  let points = [start];
  dash = 2;
  slash = 4;
  let scaleFactor = depthLeft / ogDepth;
  

  // Create jittered intermediate points
  end = addBreaks(start, end, scaleFactor, points, numSegments, angle);

  for (let i = 0; i < points.length - 1; i++) {
    let p1 = points[i];
    let p2 = points[i + 1];
    lightning.push(
      new Bolt(p1, p2, thickness, depthLeft, int(10 * scaleFactor))
    );
    
    let chance =  (1+i)/2 * (scaleFactor / 2);
    if(scaleFactor==1){
      chance = i/points.length+0.5;
    }
      

    
    if (depthLeft > 0 && random() < chance) {
      let branch = createBranchFrom(
        p1,
        p2,
        thickness * 0.5,
        depthLeft,
        i,
        points.length
      );

      if (branch) {
        generateLightning(
          branch[0],
          branch[1],
          thickness * 0.5,
          depthLeft - 1,
          branch[2]
        );
      }
    }
  }
}

function createBranchFrom(p1, p2, thickness, depthLeft, i, order) {
  let mid = p5.Vector.lerp(p1, p2, random(0, 1));
  let dir = p5.Vector.sub(p2, p1).normalize();

  let angles = atan2(dir.y, dir.x) - HALF_PI;
  let angleFromVertical = randomGaussian(0, 1);
  let scaleFactor = depthLeft / ogDepth;
  let orderFactor = 1 - i / order;

  let branchAngle;
  if (angleFromVertical < 0) {
    branchAngle = atan2(dir.y, dir.x) + radians(random(20, 40));
    branchAngle += radians(random(10, 20) / scaleFactor);
  } else {
    branchAngle = atan2(dir.y, dir.x) - radians(random(20, 40));
    branchAngle -= radians(random(10, 20) / scaleFactor);
  }

  let gravityStrength = map(ogDepth - depthLeft, 0, ogDepth, 0, 5);
  let gravityBias = createVector(0, 1).mult(random(gravityStrength));
  let branchDir = p5.Vector.fromAngle(branchAngle)
    .normalize()
    .mult(
      randomGaussian(
        length * orderFactor * scaleFactor * scaleFactor,
        sd * orderFactor * scaleFactor * scaleFactor
      )
    )
    .add(gravityBias);

  let end = p5.Vector.add(mid, branchDir);

  return [mid, end, angles];
}

class Bolts {
  constructor(start, end, bolt) {
    this.start = start;
    this.end = end;
    this.bolt = bolt;
  }
}

class Bolt {
  constructor(startPt, endPt, thickness, gens, segs) {
    this.start = startPt;
    this.end = endPt;
    this.thickness = thickness;
    this.gens = (gens / 2) * 255;
    this.segmentCount = segs;
    this.generateSegments();
  }

  changeSetting(start, end) {
    this.start = start;
    this.end = end;
    this.generateSegments();
  }

  showOriginal() {
    stroke(255, 255, 255, 200);
    strokeWeight(this.thickness);
    line(this.start.x, this.start.y, this.end.x, this.end.y);

    glowLayer.stroke(100, 100, 200, 20);
    glowLayer.strokeWeight(this.thickness * 1.5);
    glowLayer.line(this.start.x, this.start.y, this.end.x, this.end.y);
  }

  generateSegments() {
    this.segments = [];
    let segmentsCount = this.segmentCount;
    let prev = this.start.copy();
    let newX;
    let newY;

    for (let i = 1; i <= segmentsCount; i++) {
      if (i != segmentsCount) {
        let t = i / segmentsCount;

        let angleOffset = random(-PI / 6, PI / 6);
        let distanceOffset = random(-5 *scale, 5*scale);

        newX =
          lerp(this.start.x, this.end.x, t) + cos(angleOffset) * distanceOffset;
        newY =
          lerp(this.start.y, this.end.y, t) + sin(angleOffset) * distanceOffset;
      } else {
        newX = this.end.x;
        newY = this.end.y;
      }

      let next = createVector(newX, newY);
      this.segments.push({ from: prev, to: next, order: i });

      prev = next.copy();
    }
  }

  show() {
    for (let seg of this.segments) {
      let from = createVector(seg.from.x, seg.from.y);
      let to = createVector(seg.to.x, seg.to.y);
      
      let opacity = 255;
      
      if(frameCount %60 <35){
        opacity = 230+ frameCount % 60;
      }else{
        opacity= 200 - (frameCount % 60) * 3;
      }

      lightLayer.stroke(255, 255, 255, opacity);
      lightLayer.strokeWeight(this.thickness);
      lightLayer.line(from.x, from.y, to.x, to.y);

      glowLayer.stroke(100, 180, 230, 100);
      glowLayer.strokeWeight(this.thickness * 2);
      glowLayer.line(from.x, from.y, to.x, to.y);

      glowLayer.stroke(100, 200, 240, 120);
      glowLayer.strokeWeight(this.thickness * 1.5);
      glowLayer.line(from.x, from.y, to.x, to.y);

      glowLayer.stroke(100, 220, 255, 200);
      glowLayer.strokeWeight(this.thickness);
      glowLayer.line(from.x, from.y, to.x, to.y);
    }
  }
}
