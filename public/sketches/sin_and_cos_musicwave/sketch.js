let angle = 0;
let r = 50;
let myMusic;

function preload() {
  myMusic = loadSound("style.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  myMusic.loop();
  fft = new p5.FFT();
}

function keyPressed() {
  if (myMusic.isPlaying()) {
    myMusic.pause();
  } else {
    myMusic.loop();
  }
}

function draw() {
  background(0, 10);
  let spectrum = fft.analyze();

  if (mouseIsPressed) {
    scale(2, 10);
  }

  stroke(255);
  let offset = 0;
  translate(0, height / 2);
  scale(1, -1);

  strokeWeight(0.5);
  noFill();
  rectMode(CENTER);
  for (let i = 0; i < width; i += 10) {
    i += spectrum[30] / 20;
    for (let j = 0; j < height; j += 10) {
      point(i, j);
      point(i, -j);
    }
    push();
    stroke("skyblue");
    rect(i - 15, i * 6, i * 2.1, i);
    stroke("#03A9F4");
    rect(i, i * 3.1, i, i * 2);
    stroke("rgb(255,192,237)");
    rect(i * 2 + 15, i * 2.4, i * 2, 2 * i);
    stroke("yellow");
    rect(i * 3-20, i - 15, i * 2.1, i*1.5);
    stroke("#FFC107");
    rect(i *3-20, i - 55, i * 2.1, i*1.5);
    stroke("#03A9F4");
    rect(width - i / 2, -i * 2.3, i, 2 * i);
    stroke("skyblue");
    rect(width - i - 10, -i / 0.7, 1.2 * i, i / 4);
    stroke("blue");
    rect(width - i * 1.5, -i / 1.8, 1.2 * i, i / 2);
    stroke("pink");
    rect(width - i * 2, -i / 1.8,  i*2 , i/1.5);
    pop();
  }

  for (let x = 0; x < width; x += 20) {
    let y = (r * sin(angle + offset) * spectrum[20]) / 200;
    strokeWeight(2);
    // line(x *1.4, y - 300, x/1.1 , y - 600);
    // line(x, y -100 ,x *1.4, y - 300 );
     line(x * 1.4-300, y + 296,x * 1.4-300, y + 306 );
    arc(x, y - 300+x/2 , r + 20, r, 0, PI);
    arc(x, y -350+x/2, r + 20, r,  PI,2*PI);
    
   
    line(x , y - 400,x*1.1 , y - 420);
   
    arc(x * 1.8, y + 80 + x, r - 20, r - 30, PI, 2 * PI);
    arc(x * 1.8, y + 80 + x, r - 20, r - 30, 0, PI);
    offset += 0.4;
  }
  angle += 0.04;
  // r+=random(-2,2)
  // constrain(r,-spectrum[20]/200,spectrum[20]/200);

}
