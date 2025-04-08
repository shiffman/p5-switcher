class Boid {
  constructor(x, y, ratio) {
    this.position = createVector(x, y);
    this.ratio = ratio;
    this.velocity = createVector(random(-2 * ratio, 2 * ratio), random(-2 * ratio, 2 * ratio));
    this.acceleration = createVector(0, 0);
    this.maxSpeed = 3 * ratio;
    this.maxForce = 0.05 * ratio;
    this.neighborDist = 50 * ratio;
    this.desiredSeparation = 25 * ratio;
  }

  flock(boids) {
    let sep = this.separate(boids);
    let ali = this.align(boids);
    let coh = this.cohesion(boids);

    sep.mult(1.5);
    ali.mult(1.0);
    coh.mult(1.0);

    this.acceleration.add(sep);
    this.acceleration.add(ali);
    this.acceleration.add(coh);

    this.centerConnect();
  }

  separate(boids) {
    let steer = createVector(0, 0);
    let count = 0;

    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d > 0 && d < this.desiredSeparation) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.normalize();
        diff.div(d);
        steer.add(diff);
        count++;
      }
    }

    if (count > 0) {
      steer.div(count);
    }

    if (steer.mag() > 0) {
      steer.normalize();
      steer.mult(this.maxSpeed);
      steer.sub(this.velocity);
      steer.limit(this.maxForce);
    }

    return steer;
  }

  align(boids) {
    let sum = createVector(0, 0);
    let count = 0;

    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d > 0 && d < this.neighborDist) {
        sum.add(other.velocity);
        count++;
      }
    }

    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxSpeed);
      let steer = p5.Vector.sub(sum, this.velocity);
      steer.limit(this.maxForce);
      return steer;
    }

    return createVector(0, 0);
  }

  cohesion(boids) {
    let sum = createVector(0, 0);
    let count = 0;

    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d > 0 && d < this.neighborDist) {
        sum.add(other.position);
        count++;
      }
    }

    if (count > 0) {
      sum.div(count);
      return this.steerTowards(sum);
    }

    return createVector(0, 0);
  }

  steerTowards(target) {
    let desired = p5.Vector.sub(target, this.position);
    desired.normalize();
    desired.mult(this.maxSpeed);

    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxForce);

    return steer;
  }

  centerConnect() {
    stroke(255, 25);
    strokeWeight(1.5 * this.ratio);
    line(this.position.x, this.position.y, width / 2, height / 2);
  }

  update() {
    this.prevPosition = this.position;

    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }
}
