let wave = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 100);
}

function draw() {
  background(0, 0, 10);

  for (let i = 0; i < width; i += 20) {
    for (let j = 0; j < height; j += 20) {
      let d = dist(i, j, width / 2, height / 2);
      let offset = map(d, 0, width / 2, 0, 10);
      let angle = wave + offset;
      let h = map(sin(angle), -1, 1, 0, 100);

      fill(h, 80, 100);
      rect(i, j, 15, 15);
    }
  }

  wave += 0.05;
}
