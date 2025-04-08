//define the mold class，mold detect front, left, and right, based on current position and direction of the mold
class Mold {
  constructor() {
    // use "this." keyword to eliminate the confusion between class attributes and parameters with the same name
    // Set initial position of the mold in a central region of the canvas
    this.x = (width / 4, (3 * width) / 4);
    this.y = (height / 4, (3 * height) / 4);
    // Set the radius of the mold
    this.r = 0.5;

    // / Randomly assign an initial direction (heading) in degrees
    this.heading = random(360);
    // Calculate velocity components based on the heading
    this.vx = cos(this.heading);
    this.vy = sin(this.heading);
    // Define the angle of rotation for changing direction
    this.rotAngle = 45;

    //more sensing components, vector: arrow pointing in space, for motion, speed and direction
    // Initialize sensor positions for detecting surroundings
    this.rSensorPos = createVector(0, 0); //right sensor
    this.lSensorPos = createVector(0, 0); //left sensor
    this.fSensorPos = createVector(0, 0); //front sensor
    this.sensorAngle = 45; // Angle between sensors
    this.sensorDist = 15; // Default distance of the sensors from the mold
  }

  // sensing position is going to be based on the current position of the mold
  // conversion from Polar coordinates to cartisian coordinates
  // Update the mold's position, sensors, and heading based on environment
  update() {
    // calculate distance to the mouse
    let distanceToMouse = dist(this.x, this.y, mouseX, mouseY);
    // if close to the mouse, increase sensor distance
    if (distanceToMouse < 110) { 
      this.sensorDist = map(distanceToMouse, 0, 100, 100, 0); 
    } else {
      // reset to default sensor distance when far from the mouse
      this.sensorDist = 15; 
    }

    // update mold movement based on heading angle
    this.vx = cos(this.heading);
    this.vy = sin(this.heading);
    // use modulo to move the mold and wrap around the edges of the canvas
    this.x = (this.x + this.vx + width) % width;
    this.y = (this.y + this.vy + height) % height;

    //call method within class, have to add "this."
  
    //update the position of the sensors
    this.getSensorPos(this.rSensorPos, this.heading + this.sensorAngle);
    this.getSensorPos(this.lSensorPos, this.heading - this.sensorAngle);
    this.getSensorPos(this.fSensorPos, this.heading);
    
    //radius R * cosine of angle, based on the current angle of mold which is(this.heading, and then add the new sensing angle)
    
    this.fSensorPos.x = this.x + this.sensorDist * cos(this.heading);
    this.fSensorPos.y = this.y + this.sensorDist * sin(this.heading);

    // Read pixel values at sensor positions and make decisions based on readings
    let index, l, r, f;
    index =
      4 * (d * floor(this.rSensorPos.y)) * (d * width) +
      4 * (d * floor(this.rSensorPos.x));
    r = pixels[index];

    index =
      4 * (d * floor(this.lSensorPos.y)) * (d * width) +
      4 * (d * floor(this.lSensorPos.x));
    l = pixels[index];

    index =
      4 * (d * floor(this.fSensorPos.y)) * (d * width) +
      4 * (d * floor(this.fSensorPos.x));
    f = pixels[index];

    //Compare values of f, l, and r to determine movement
    if (f > l && f > r) {
      // move straight if front sensor detects the strongest signal
      this.heading += 0;
    } else if (f < l && f < r) {
      // turn left OR right if front sensor is weak, with a random chance
      if (random(1) < 0.5) {
        this.heading += this.rotAngle;
      } else {
        this.heading -= this.rotAngle;
      }
      // left if left sensor detects stronger signal
    } else if (l > r) {
      this.heading += -this.rotAngle;
      // right if right sensor detects stronger signal
    } else if (r > l) {
      this.heading += this.rotAngle;
    }
  }

  display() {
    noStroke();
    // Choose color palette based on the current palette value
    let colorNoise = noise(this.x * 0.01, this.y * 0.01); // use Perlin noise for smooth blend between the moldy colors

    // Map the noise value to the RGB color range (blend between green, yellow, and blue)
    let r = map(colorNoise, 0, 1, 100, 200); 
    let g = map(colorNoise, 0, 1, 150, 255); 
    let b = map(colorNoise, 0, 1, 50, 255); 
    // Set the fill color based on the noise value
    fill(r, g, b); 

    // Draw the mold as an ellipse at its current position
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }

  // update sensor position based on the mold's current angle and sensor distance
  getSensorPos(sensor, angle) {
    // calculate the new sensor position using polar coordinates (angle and distance)
    sensor.x = (this.x + this.sensorDist * cos(angle) + width) % width;
    sensor.y = (this.y + this.sensorDist * sin(angle) + height) % height;
  }
}

//pixel(): an one-dimensional array containing color of each pixel on the canvas (RGBA)
//pixelDensity(): returns the pixel density of the canvas
//loadPixels() must be called before accessing the pixels array, updatePixles() must be called after any changes are made.
