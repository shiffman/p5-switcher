class Fish extends Bead {
  constructor(img) {
    super({
      x: random(700),
      y: random(400),
      mass: 500,
      tone: 0,
    });

    this.bubbles = [];
    this.img = img;
    this.maxspeed = 5;
    this.maxforce = 0.1;
    this.acceleration = createVector(0, 0);
  }

  pursue(target) {
    let prediction = target.velocity.copy();
    prediction.mult(10);
    let futurePos = p5.Vector.add(target.position, prediction);
    return this.seek(futurePos.x, futurePos.y);
  }

  evade(fish) {
    let pursuit = this.pursue(fish);
    pursuit.mult(-1);
    return pursuit;
  }

  seek(targetX, targetY) {
    let target = createVector(targetX, targetY);
    let desired = p5.Vector.sub(target, this.position);
    desired.setMag(this.maxspeed);

    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);

    this.acceleration.add(steer);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);


    if (target) {
      this.pursue(target);
    }


    if (random() > 0.9) {
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
    rotate(this.velocity.heading());
    imageMode(CENTER);
    if (this.img) {
      image(this.img, 0, 0, this.diameter * 4, this.diameter * 3);
    }
    pop();

    for (let bubble of this.bubbles) {
      bubble.show();
    }
  }
}


class Target extends Fish {
  constructor(x, y) {
    super(img1);
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D();
    this.velocity.mult(2);
  }
  
  show() {
  push();
  translate(this.position.x, this.position.y);
  imageMode(CENTER);
  image(img1, 0, 0, 40, 50);
  pop();
}

  update() {
    this.position.add(this.velocity);


    if (this.position.x < 0 || this.position.x > width) this.velocity.x *= -1;
    if (this.position.y < 0 || this.position.y > height) this.velocity.y *= -1;
  }
}