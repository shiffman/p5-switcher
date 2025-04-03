class Bubble extends Bead {
  constructor({x, y} = {}){
    super({
      x: x,
      y: y,
      mass: randomGaussian(100, 20),
      vx: randomGaussian(0, 2),
      vy: -7,
      tone: 60,
    });
    this.dead = false;
    class Fish extends Bead {
  constructor(img) {
    super({
      x: width / 2,
      y: height / 2,
      mass: 500,
      tone: 0,
    });

    this.bubbles = [];
    this.img = img;
    this.maxspeed = 5;
    this.maxforce = 0.2;
    this.acceleration = createVector(0, 0);
    this.diameter = 30; 
  }

  seek(targetX, targetY) {
    let target = createVector(targetX, targetY);
    let desired = p5.Vector.sub(target, this.position);
    desired.setMag(this.maxspeed);

    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);

    this.applyForce(steer);
  }

  update() {
    super.update();

    let force = p5.Vector.fromAngle(random(TWO_PI));
    force.setMag(0.1); 
    this.applyForce(force);

    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);

    if (this.position.x < 0 || this.position.x > width) this.velocity.x *= -1;
    if (this.position.y < 0 || this.position.y > height) this.velocity.y *= -1;

    this.angle = this.velocity.heading();

    if (random() > 0.95) {
      this.bubbles.push(
        new Bubble({
          x: this.position.x,
          y: this.position.y,
        })
      );
    }

    for (let bubble of this.bubbles) {
      bubble.update();
    }

    this.bubbles = this.bubbles.filter((bubble) => !bubble.dead);
  }

  show() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.angle);
    imageMode(CENTER);

    if (this.img) {
      image(this.img, 0, 0, this.diameter * 2.7, this.diameter * 2);
    }

    pop();

    for (let bubble of this.bubbles) {
      bubble.show();
    }
  }
}

  }
  
  show(){
    push();
      noStroke();
      fill(255, random(255));
      rect(floor(this.x / 5) * 5, floor(this.y / 5) * 5, 9, 9);
    pop();
  }
  
  update(){
    super.update();
    this.velocity.x += random(1, -1);
    if(this.y < 0){
      this.dead = true;
    }
  }
  
}