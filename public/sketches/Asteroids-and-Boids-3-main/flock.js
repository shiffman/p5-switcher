class Flock {

  constructor() {
    // An array for all the boids
    this.boids = []; // Initialize the array
  }

  run(asteroid, boundary, sepWeight, aliWeight, cohWeight) {
    for (let boid of this.boids) {
      boid.run(this.boids, asteroid, boundary, sepWeight, aliWeight, cohWeight);  // Passing the entire list of boids to each boid individually
    }
  }

  addBoid(b) {
    this.boids.push(b);
  }
}