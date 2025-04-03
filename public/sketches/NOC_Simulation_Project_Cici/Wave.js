class Wave {
  constructor(amplitude, frequency, yOffset) {
    this.amplitude = amplitude;
    this.frequency = frequency;
    this.yOffset = yOffset;
  }

  display() {
    noFill();
    stroke(150, 220, 255,random(20,55)); 
    strokeWeight(2);

    beginShape();
    for (let x = 0; x < width; x++) {
      let angle = this.frequency * (x + frameCount * 0.5);
      let y = this.amplitude * sin(angle) + this.yOffset + sin((x + frameCount) * 0.02) * 500 + cos((x + frameCount) * 0.015) * 150 + 800;

          
      vertex(x, y);
    }
    
    endShape();
  }
}
