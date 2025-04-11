// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Path Following


class Path {
  
  constructor() {
    // Arbitrary radius of 20
    // A path has a radius, i.e how far is it ok for the boid to wander off
    this.radius = strokeW*4;
    // A Path is an arraylist of points (PVector objects)
    this.points = [];
  }

  // Add a point to the path
  addPoint(x, y) {
    let point = createVector(x, y);
    this.points.push(point);
  }

  // Draw the path
  display(color) {
    strokeJoin(ROUND);
    // Draw thin line for radius
    stroke(0)
    strokeWeight((this.radius) * 2 * SizeF);
    noFill();
    beginShape();
    for (let v of this.points) {
      vertex(v.x, v.y);
    }
    endShape(CLOSE);
    // Draw thick line for radius
    stroke(200)
    strokeWeight((this.radius - strokeW) * 2 * SizeF);
    noFill();
    beginShape();
    for (let v of this.points) {
      vertex(v.x, v.y);
    }
    endShape(CLOSE);
  }

  getLength() {
    let len = 0;
    for (let i = 1; i < this.points.length; i++) {
      len += p5.Vector.dist(this.points[i - 1], this.points[i]);
    }
    return len;
  }
}
