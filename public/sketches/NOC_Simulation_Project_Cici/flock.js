class Flock {

  constructor() {

    this.boids = [];
  }

  run() {
    for (let boid of this.boids) {
      boid.run(this.boids); // Passing the entire list of boids to each boid individually
    }
  }

  addBoid(b) {
    this.boids.push(b);
  }
}