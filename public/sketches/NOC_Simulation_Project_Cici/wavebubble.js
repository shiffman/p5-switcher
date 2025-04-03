class wavebubble {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(2, 5);
  }

  move() {
    this.y -= random(0.5, 1.5); 
    if (this.y < 0) {
      this.y = random(height / 2, height);
      this.x = random(width); 
    }
  }

  display() {
    noStroke();
    fill(255, 255, 255, random(150)); 
    rect(this.x, this.y, this.size);
  }
}
