let sections = [];
let colors;
let phase = 0; // 0: idle (with potential fade-in), 1: spread, 2: gather, 3: shake, 4: reorg, 5: fade-out/reset
let timer = 0;
const DUR = { 
  spread: 60,  
  gather: 20, 
  shake: 20, 
  reorg: 90
};
const FADE_DURATION = 60; // Duration for fade-out (phase 5)
const FADE_IN_DURATION = 60; // Duration for fade-in after a low-FPS reset
const MAX = { spread: 100, shakeOffset: 20, shakeRot: 0.2 };
let idleTimer; // Idle delay in phase 0
let resetAfterCycle = false; // Set to true when FPS drops below 24 during a cycle
let fadeInTimer = 0; // Timer for fade-in effect
let lowFpsReset = false; // Indicates that the last reset was due to low FPS (phase 5 occurred)

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  colors = [
    color(224, 13, 30),
    color(255, 221, 10),
    color(5, 56, 137),
    color(231, 233, 232),
  ];
  initSections();
  idleTimer = 120; // Initial idle delay (in frames)
}

function draw() {
  background(0);
  
  // Monitor FPS – if it falls below 24 during a cycle, mark the cycle for reset.
  if (!resetAfterCycle && frameRate() < 24) {
    resetAfterCycle = true;
  }
  
  push();
  // Center and scale the original 600×600 design to fit a 1080×1080 area.
  translate(0, (height - 1080) / 2);
  scale(1.8);
  
  if (phase === 0) {
    // Idle phase: show sections at their base positions.
    sections.forEach(section => {
      section.drawAt(section.basePos);
    });
    idleTimer--;
    if (idleTimer <= 0) {
      sections.forEach(s => s.computeSpreadDir());
      phase = 1;
      timer = DUR.spread;
    }
  } else if (phase === 1) {
    // Spread phase: move sections outward (easeOutSine).
    let progress = easeOutSine((DUR.spread - timer) / DUR.spread);
    sections.forEach(section => {
      let spreadPos = p5.Vector.add(
        section.basePos,
        p5.Vector.mult(section.spreadDir, progress * MAX.spread)
      );
      section.drawAt(spreadPos);
    });
    if (--timer <= 0) {
      phase = 2;
      timer = DUR.gather;
    }
  } else if (phase === 2) {
    // Gather phase: move sections back (easeInSine).
    let progress = easeInSine((DUR.gather - timer) / DUR.gather);
    sections.forEach(section => {
      let gatherPos = p5.Vector.add(
        section.basePos,
        p5.Vector.mult(section.spreadDir, (1 - progress) * MAX.spread)
      );
      section.drawAt(gatherPos);
    });
    if (--timer <= 0) {
      phase = 3;
      timer = DUR.shake;
    }
  } else if (phase === 3) {
    // Shake phase: apply random translations and rotations.
    let decayFactor = timer / DUR.shake;
    sections.forEach(section => {
      section.drawShake(decayFactor);
    });
    if (--timer <= 0) {
      subdivide();
      phase = 4;
      timer = DUR.reorg;
    }
  } else if (phase === 4) {
    // Reorganization phase: interpolate sections to their target positions.
    let progress = (DUR.reorg - timer) / DUR.reorg;
    sections.forEach(section => {
      if (section.target) {
        let interpPos = p5.Vector.lerp(section.basePos, section.target, progress);
        section.drawAt(interpPos);
      } else {
        section.drawAt(section.basePos);
      }
    });
    if (--timer <= 0) {
      sections.forEach(section => {
        if (section.target) {
          section.basePos = section.target.copy();
          section.target = null;
        }
      });
      // If a low-FPS event was detected, transition to fade-out.
      if (resetAfterCycle) {
        phase = 5;
        timer = FADE_DURATION;
      } else {
        phase = 0;
        idleTimer = 120;
      }
    }
  } else if (phase === 5) {
    // Fade-out phase: freeze the scene.
    sections.forEach(section => {
      section.drawAt(section.basePos);
    });
  }
  
  pop();
  
  // Phase 5: Fade-out overlay.
  if (phase === 5) {
    let fadeAlpha = map(timer, FADE_DURATION, 0, 0, 255);
    noStroke();
    fill(0, fadeAlpha);
    rectMode(CORNER);
    rect(0, 0, width, height);
    timer--;
    if (timer <= 0) {
      resetSketch();
    }
  }
  
  // In phase 0: if the reset was triggered by low FPS, show the fade-in overlay.
  if (phase === 0 && lowFpsReset && fadeInTimer > 0) {
    let fadeAlpha = map(fadeInTimer, FADE_IN_DURATION, 0, 255, 0);
    noStroke();
    fill(0, fadeAlpha);
    rectMode(CORNER);
    rect(0, 0, width, height);
    fadeInTimer--;
    if (fadeInTimer <= 0) {
      // Fade-in happens only once after phase 5.
      lowFpsReset = false;
    }
  }
  
  // Display current FPS in the top-left corner.
  // fill(255);
  // textSize(32);
  // text("FPS: " + nf(frameRate(), 2, 1), 10, 30);
}

const easeOutSine = t => sin((t * PI) / 2);
const easeInSine = t => 1 - cos((t * PI) / 2);

function subdivide() {
  let currentFPS = frameRate();
  for (let i = sections.length - 1; i >= 0; i--) {
    let s = sections[i];
    if (currentFPS < 24 && s.depth >= 2) continue;
    let prob = constrain(0.5 + 0.05 * s.depth, 0, 0.9);
    if (random() < prob) {
      let c1, c2;
      if (random() < 0.5) {
        let r = random(0.3, 0.7);
        c1 = new Section(s.basePos.x, s.basePos.y, s.w * r, s.h, s.col, s.depth + 1);
        c2 = new Section(s.basePos.x + s.w * r, s.basePos.y, s.w * (1 - r), s.h, s.col, s.depth + 1);
      } else {
        let r = random(0.3, 0.7);
        c1 = new Section(s.basePos.x, s.basePos.y, s.w, s.h * r, s.col, s.depth + 1);
        c2 = new Section(s.basePos.x, s.basePos.y + s.h * r, s.w, s.h * (1 - r), s.col, s.depth + 1);
      }
      c1.target = c1.basePos.copy();
      c2.target = c2.basePos.copy();
      sections.splice(i, 1);
      sections.push(c1, c2);
    }
  }
}

class Section {
  constructor(x, y, w, h, col, depth = 0) {
    this.basePos = createVector(x, y);
    this.w = w;
    this.h = h;
    this.col = col;
    this.depth = depth;
    this.spreadDir = createVector(0, 0);
    this.target = null;
    this.fre = 0.05;
    this.flag = true;
  }
  
  computeSpreadDir() {
    let center = createVector(this.basePos.x + this.w/2, this.basePos.y + this.h/2);
    let corners = [
      createVector(0, 0),
      createVector(600, 0),
      createVector(0, 600),
      createVector(600, 600)
    ];
    let nearest = corners[0], minD = p5.Vector.dist(center, nearest);
    for (let c of corners) {
      let d = p5.Vector.dist(center, c);
      if (d < minD) {
        minD = d;
        nearest = c;
      }
    }
    this.spreadDir = p5.Vector.sub(nearest, center).normalize();
  }
  
  drawAt(pos) {
    push();
    translate(pos.x + this.w/2, pos.y + this.h/2);
    if (this.flag) {
      this.fre = 0.05;
      this.flag = false;
    }
    if (phase === 4) {
      let wiggle = sin(frameCount * this.fre + this.depth) * this.fre * 2;
      rotate(wiggle);
      this.fre *= 0.97;
      if (this.fre <= 0.001) {
        sections.forEach(section => {
          if (section.target) {
            section.basePos = section.target.copy();
            section.target = null;
          }
        });
        phase = 0;
      }
    }
    if (phase === 0) {
      this.flag = true;
    }
    rectMode(CENTER);
    fill(this.col);
    stroke(0);
    strokeWeight(1);
    rect(0, 0, this.w, this.h);
    pop();
  }
  
  drawShake(decay) {
    push();
    translate(this.basePos.x + this.w/2, this.basePos.y + this.h/2);
    let sc = 1 + random(-0.1, 0.1);
    scale(sc);
    translate(
      random(-MAX.shakeOffset * decay, MAX.shakeOffset * decay),
      random(-MAX.shakeOffset * decay, MAX.shakeOffset * decay)
    );
    rotate(random(-MAX.shakeRot * decay, MAX.shakeRot * decay));
    rectMode(CENTER);
    fill(this.col);
    stroke(0);
    strokeWeight(1);
    rect(0, 0, this.w, this.h);
    pop();
  }
}

function initSections() {
  sections = [];
  sections.push(new Section(50, 50, 250, 200, colors[0], 0));
  sections.push(new Section(310, 50, 240, 200, colors[1], 0));
  sections.push(new Section(50, 260, 200, 280, colors[2], 0));
  sections.push(new Section(260, 260, 290, 280, colors[3], 0));
}

function resetSketch() {
  initSections();
  phase = 0;
  idleTimer = 120;
  // Only trigger fade-in if this reset was due to low FPS (phase 5).
  if (resetAfterCycle) {
    lowFpsReset = true;
    fadeInTimer = FADE_IN_DURATION;
  }
  resetAfterCycle = false;
}
