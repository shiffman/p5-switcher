class Asteroid {
    constructor() {
      // All of our regular motion stuff
      this.position = createVector(width / 2, height / 2);
      this.velocity = createVector();
      this.acceleration = createVector();
  
      // Arbitrary damping to slow down asteroid
      this.damping = 0.995;
      this.topspeed = 6;
      this.maxforce = 0.1;  // Maximum steering force
  
      // Variable for heading!
      this.heading = 0;
  
      // Size
      this.r = 16;
  
      // Are we thrusting (to color boosters)
      this.thrusting = false;
    }
  
    // Standard Euler integration
    update() {
      this.velocity.add(this.acceleration);
      this.velocity.mult(this.damping);
      this.velocity.limit(this.topspeed);
      this.position.add(this.velocity);
      this.acceleration.mult(0);

      // // Update heading based on velocity
      // if (this.velocity.mag() > 0) {
      //   this.heading = this.velocity.heading();
      // }
    }

    // Update the heading to point towards a target
    pointTowards(target) {
      // Calculate the angle between the asteroid and the target
      let desired = p5.Vector.sub(target, this.position);
      this.heading = desired.heading();
    }
    
    // Newton's law: F = M * A
    applyForce(force) {
      let f = force.copy();
      //f.div(mass); // ignoring mass right now
      this.acceleration.add(f);
    }
  
    // Turn changes angle
    turn(angle) {
      this.heading += angle;
    }
  
    // Apply a thrust force
    thrust() {
      // Offset the angle since we drew the asteroid vertically
      let angle = this.heading - PI / 2;
      let force = p5.Vector.fromAngle(angle);
      force.mult(0.1);
      this.applyForce(force);
      // To draw booster
      this.thrusting = true;
    }
  
    wrapEdges() {
      let buffer = this.r * 2;
      if (this.position.x > width + buffer) this.position.x = -buffer;
      else if (this.position.x < -buffer) this.position.x = width + buffer;
      if (this.position.y > height + buffer) this.position.y = -buffer;
      else if (this.position.y < -buffer) this.position.y = height + buffer;
    }

    seek(target) {
      let desired = p5.Vector.sub(target, this.position);
      let distance = desired.mag();
      let speed = map(distance, 0, width, this.topspeed, 0); // Adjust speed based on distance
      desired.setMag(speed);
      let steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.maxforce);
      this.applyForce(steer);
    }

    arrive(target) {
      let desired = p5.Vector.sub(target, this.position);
      let d = desired.mag();

      // // Point the asteroid towards the mouse
      // this.pointTowards(target);

      if (d < 100) {
        let m = map(d, 0, 100, 0, this.topspeed);
        desired.setMag(m);
      } else {
        desired.setMag(this.topspeed);
      }
      let steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.maxforce);
      this.applyForce(steer);
    }
  
    show() {
      // Draw a triangle rotated in the direction of velocity
      let angle = this.velocity.heading();
      fill(255);
      noStroke();
      push();
      translate(this.position.x, this.position.y);
      rotate(angle + PI / 2);
      beginShape();
      vertex(0, -this.r * 2);
      vertex(this.r, this.r * 1.5);
      vertex(0, this.r);
      vertex(-this.r, this.r * 1.5);
      endShape(CLOSE);
      pop();
    }
  }
  