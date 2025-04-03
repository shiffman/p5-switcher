class Jellyfish {
  constructor(x, y, phaseOffset) {
    this.origin = createVector(x, y);
    this.position = createVector(x, y);
    this.oscillationAngle = phaseOffset;
    this.oscillationSpeed = 0.05; 
    this.waveAmplitude = 10; 
    this.size = 13;
  }

  update() {
    this.position.y = this.origin.y + sin(this.oscillationAngle) * this.waveAmplitude;
    this.position.x = this.origin.x + cos(this.oscillationAngle * 0.5) * this.waveAmplitude * 0.4;
    this.oscillationAngle += this.oscillationSpeed;
  }

  display() {
    noSmooth(); 
    fill(150, 100, 255);
    stroke(50, 30, 100);
    

    rect(this.position.x, this.position.y, this.size, this.size);
    

    for (let i = 0; i < 6; i++) {
      let angle = i * TWO_PI / 6;
      let x = this.position.x + cos(angle) * this.size * 0.8;
      let y = this.position.y + sin(angle) * this.size * 0.8 + 4;
      let sway = round(sin(this.oscillationAngle * 2 + i) * 2); 
      
      rect(x + sway, y + 6, 2, 2); 
    }
  }
}
