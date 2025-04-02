class Vehicle {
  constructor(x, y,t) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(1, this.maxSpeed));
    this.acc = createVector(0, 0); 
    this.maxSpeed = random(4, 10);
    this.maxForce = random(0.4, 0.8);
    this.r = random(40, 100);

    this.wanderTheta = random(PI,PI*2);
    this.wanderScale = random(0.05, 2);
    this.xoff = random(1000);

    this.currentPath = [];
    this.paths = [this.currentPath];
    this.stopped = false;
    this.lerpAmt = sin(t*PI) * 0.5 + 0.2;
        this.fade = 255; // 初始不透明度
    // 定义初始颜色（绿色）和目标颜色（深红色），可根据需要调整
    this.initialColor = color(random(30,90), random(90,230), random(30,100));
    this.landedColor = color(255, 100, 0);
    
    this.batch = currentBatch;
  }

  wander() {
    if (this.stopped) return;
    let angle = noise(this.xoff) * TWO_PI /1.3;
    let steer = p5.Vector.fromAngle(angle);
    steer.setMag(this.maxForce * this.wanderScale);
    this.applyForce(steer);
    this.xoff -= 0.01;
  }

  // evade(vehicle) {
  //   let pursuit = this.pursue(vehicle);
  //   pursuit.mult(-1);
  //   return pursuit;
  // }

  // pursue(vehicle) {
  //   let target = vehicle.pos.copy();
  //   let prediction = vehicle.vel.copy();
  //   prediction.mult(10);
  //   target.add(prediction);
  //   fill(0, 255, 0);
  //   circle(target.x, target.y, 16);
  //   return this.seek(target);
  // }

  arrive(target) {
    // 2nd argument true enables the arrival behavior
    return this.seek(target, true);
  }

  flee(target) {
    return this.seek(target).mult(-1);
  }

  seek(target, arrival = false) {
    let force = p5.Vector.sub(target, this.pos);
    let desiredSpeed = this.maxSpeed;
    if (arrival) {
      let slowRadius = random(50, 150);
      let distance = force.mag();
      if (distance < slowRadius) {
        desiredSpeed = map(distance, 0, slowRadius, 0, this.maxSpeed);
      }
    }
    force.setMag(desiredSpeed);
    force.sub(this.vel);
    force.limit(this.maxForce);
    return force;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    // 如果未落地，则继续更新位置
    if (!this.stopped) {
      this.vel.add(this.acc);
      this.vel.limit(this.maxSpeed);
      this.pos.add(this.vel);
      this.acc.set(0, 0);
      this.currentPath.push(this.pos.copy());

      // 当叶子到达画布底部附近时（可以根据叶子的尺寸调整偏移量），标记为落地状态
      if (this.pos.y >= height - this.r / 2) {
        this.pos.y = height - this.r / 2; // 固定在底部
        this.stopped = true;
        // 清零速度与加速度，使其保持当前姿势
        this.vel.mult(0);
        this.acc.mult(0);
      }

       this.currentPath.push(this.pos.copy());
      
     // // 控制轨迹的长度
     //  let total = 0;
     //  for (let path of this.paths) {
     //    total += path.length;
     //  }
     //  if (total > 600 || (total > 2 && millis() > 5000)) {
     //    this.paths[0].shift();
     //    if (this.paths[0].length === 0) {
     //      this.paths.shift();
     //    }
     //  }
    }
  }

  show() {
   
       let baseColor = color(0, 130, 29);
    let highlightColor = color(250, 196, 2);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading() - 90);
    // 叶子颜色设置
  
        let drawColor;
    if (this.stopped && this.batch < currentBatch) {
      // 当 fade 从 255 下降到 0，混合比例从 0 到 1
      let amt = 1 - this.fade / 255;
      drawColor = lerpColor(this.initialColor, this.landedColor, amt);
      // 同时设置 alpha 为当前 fade 值
      drawColor.setAlpha(this.fade);
    } else {
      drawColor = this.initialColor;
    }
    fill(drawColor);
    noStroke();
    beginShape();
    // 开始和结束点
    curveVertex(0, 0);
    curveVertex(0, 0);
    // 叶子的左侧轮廓点
    for (let i = 1; i <= 6; i++) {
      let t = i / 6;
      let leafwidth = (sin(t * PI) * this.r) / 2.5;
      let xOffset = (sin(t * PI * 2) * this.r) / 300;
      
    // fill(lerpColor(baseColor, highlightColor, this.lerpAmt));
      //print(this.lerpAmt);
      curveVertex(-leafwidth + xOffset, t * this.r);
    }
    curveVertex(0, this.r);
    // 叶子的右侧轮廓点
    for (let i = 6; i >= 1; i--) {
      let t = i / 6;
      let leafwidth = (sin(t * PI) * this.r) / 5;
      // 添加一些随机变化
      let xOffset = (sin(t * PI * 2) * this.r) / 20;
      curveVertex(leafwidth + xOffset, t * this.r);
    }
    // 结束点
    curveVertex(0, 0);
    curveVertex(0, 0);
    endShape();
    pop();
    
    for (let path of this.paths) {
      beginShape();
      noFill();
      stroke(drawColor);
      strokeWeight(1);
      for (let v of path) {
        vertex(v.x, v.y);
      }
      endShape();
    }
  }

  edges() {
    let hitEdge = false;
    if (this.stopped) return;
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
      hitEdge = true;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
      hitEdge = true;
    }
    // if (this.pos.y > height + this.r) {
    //   this.pos.y = -this.r;
    //   hitEdge = true;
    // }
    else if (this.pos.y < -this.r) {
      this.pos.y = this.r;
      this.pos.x = width + this.r;
      hitEdge = true;
    }

    if (hitEdge) {
      this.currentPath = [];
      this.paths.push(this.currentPath);
    }

    // if (this.stopped) return;
    // if (this.pos.x > width + this.r) {
    //   this.pos.x = -this.r;
    // } else if (this.pos.x < -this.r) {
    //   this.pos.x = width + this.r;
    // }
    // if (this.pos.y < -this.r) {
    //   this.pos.y = height -2* this.r;
    //    hitEdge = true;
    // }
  }
}

// class Target extends Vehicle {
//   constructor(x, y) {
//     super(x, y);
//     this.vel = p5.Vector.random2D();
//     this.vel.mult(5);
//   }

//   show() {
//     stroke(255);
//     strokeWeight(2);
//     fill("#F063A4");
//     push();
//     translate(this.pos.x, this.pos.y);
//     circle(0, 0, this.r * 2);
//     pop();
//   }
// }
