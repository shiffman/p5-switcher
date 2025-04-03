class Bead {
  
  constructor({x, y, mass, tone, vx, vy} = {}){
    if(x === undefined) x = random(width);
    if(y === undefined) y = random(height);
    if(tone === undefined) tone = random(100);
    
    if(mass === undefined) {
      mass = (width * height) / 100;
      mass = randomGaussian(mass, mass / 2);
    }
    this.mass = mass;
    
    this.position = createVector(x, y);
    this.tone = tone;
    this.acceleration = createVector(0, 0);

    
    if(vx === undefined) {
      let vel = p5.Vector.fromAngle(random(PI), random(this.radius));
      vx = vel.x;
      vy = vel.y;
    }
    this.velocity = createVector(vx, vy);
  }
  
  get x(){
    return this.position.x;
  }
  
  get y(){
    return this.position.y;
  }
  
  get radius(){
    return sqrt(this.mass / PI);
  }
  
  set radius(r){
    this.mass = PI * r * r;
  }
  
  get diameter(){
    return 2 * this.radius;
  }
  
  show(){
    push();
    strokeWeight(this.diameter);
    if(isNaN(this.tone)){
      color(this.tone);
    } else {
      noStroke();
      fill(255, this.alpha);
      rect(floor(this.x / 5) * 5, floor(this.y / 5) * 5, 10, 10);
    }
    pop();
  }
  
  update(){
    this.velocity.limit(2 * this.diameter);
    this.position.add(this.velocity);
  }
  
  applyForce(force){
    let acc = p5.Vector.div(force, this.mass);
    this.velocity.add(acc);
  }
  
  bounceFrom(other, factor = 1){
    if(this === other) return;
    let direction = createVector(this.x - other.x, this.y - other.y);
    let d = direction.mag();
    let D = this.radius + other.radius; // distance where they touch
    if(d > D) return;
    let force = p5.Vector.fromAngle(direction.heading());
    force.setMag(
      factor *
      (this.mass + other.mass) * 
      map(d, 0, D, 1, 0)
    );
    this.applyForce(force);
  }
  
  attractTo(other, factor = 1){
    let direction = createVector(other.x - this.x, other.y - this.y);
    let d = direction.mag();
    let D = this.radius + other.radius; // distance where they touch
    if(d < D) return;
    let force = p5.Vector.fromAngle(direction.heading());
    force.setMag(
      factor *
      this.mass * other.mass /
      pow(d, 2)
    );
    this.applyForce(force);
  }
  
}