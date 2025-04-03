// Alan Ren
// Spring 2025
// NYU ITP
// 3D Game of Life

// World dimensions
const worldWidth = 15;
const worldHeight = 15;
const worldDepth = 15;

// Game rules
const RULES = {
  // Survival rules - cells with neighbors in this range survive
  surviveMin: 3,
  surviveMax: 5,
  // Birth rules - dead cells with neighbors in this range become alive
  birthMin: 4,
  birthMax: 4,
  // Energy system - cells consume energy each generation
  energyGain: 1, // Energy gained per generation when conditions are ideal
  energyDrain: 1, // Energy lost per generation
  energyThreshold: 5, // Energy needed to stay alive
  maxEnergy: 15, // Maximum energy a cell can store
};

// Visual settings
const cellSize = 1;
const cellSpacing = 1;
let cameraDistance = 42;

// Orbital camera settings
let autoRotateX = 0.003;
let autoRotateY = 0.002;
let cameraPulse = 0;
let zoomFactor = 0;

// Simulation settings
let isRunning = true;
let simulationSpeed = 10;
let lastStepTime = 0;
let generation = 0;

// Cells data
let cells = [];
let cellsEnergy = []; // Energy level of each cell instead of just age
let cellsType = []; // Different cell types for varied behavior
let particles = []; // Particle effects for newly born cells

// Seasonal cycle (rules slightly change over time)
let seasonCycle = 0;
const SEASON_LENGTH = 500; // Frames per season cycle

// ---- SETUP ----
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  perspective(PI / 3, width / height, 0.1, 1000);
  frameRate(60);
  noStroke();

  // Initialize cells
  initializeWorld();
  randomizeCells(0.05);
}

// ---- WORLD INITIALIZATION ----
function initializeWorld() {
  // Create all cells
  for (let z = 0; z < worldDepth; z++) {
    for (let y = 0; y < worldHeight; y++) {
      for (let x = 0; x < worldWidth; x++) {
        const index = x + y * worldWidth + z * worldWidth * worldHeight;
        cells[index] = {
          index: index,
          position: { x, y, z },
          isAlive: false,
          shouldDie: false,
          shouldBorn: false,
        };
        cellsEnergy[index] = 0;
        // Assign cell types - 3 different types with slightly different behaviors
        cellsType[index] = Math.floor(random(0, 3));
      }
    }
  }
}

function randomizeCells(probability) {
  for (let i = 0; i < cells.length; i++) {
    cells[i].isAlive = Math.random() < probability;
    if (cells[i].isAlive) {
      // Give initial cells a random amount of energy
      cellsEnergy[i] = Math.floor(
        random(RULES.energyThreshold, RULES.maxEnergy)
      );
    } else {
      cellsEnergy[i] = 0;
    }
  }
  generation = 0; // Reset generation counter
  particles = []; // Clear particle effects
}

// ---- GAME LOGIC ----
function updateGame() {
  // Update at specified intervals
  if (isRunning && millis() - lastStepTime > 1000 / simulationSpeed) {
    // Update seasonal cycle
    seasonCycle = (seasonCycle + 1) % SEASON_LENGTH;

    applyRules();
    updateCellStates();
    lastStepTime = millis();
    generation++;

    // Auto-reset if stagnant or exceeded max generations
    if (generation > 300) {
      checkActivity();
    }
  }

  // Update particles each frame
  updateParticles();
}

function applyRules() {
  // Get seasonal modifiers
  const seasonalModifiers = getSeasonalModifiers();

  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    const aliveNeighbors = countAliveNeighbors(cell);
    const cellType = cellsType[i];

    // Apply type-specific rule modifiers
    const typeModifiers = getCellTypeModifiers(cellType);

    // Combine seasonal and type modifiers
    const surviveMin =
      RULES.surviveMin +
      seasonalModifiers.surviveMin +
      typeModifiers.surviveMin;
    const surviveMax =
      RULES.surviveMax +
      seasonalModifiers.surviveMax +
      typeModifiers.surviveMax;
    const birthMin =
      RULES.birthMin + seasonalModifiers.birthMin + typeModifiers.birthMin;
    const birthMax =
      RULES.birthMax + seasonalModifiers.birthMax + typeModifiers.birthMax;

    if (cell.isAlive) {
      // Energy system - always consume energy each turn
      cellsEnergy[i] -= RULES.energyDrain;

      // Ideal conditions give energy boost
      if (aliveNeighbors >= surviveMin && aliveNeighbors <= surviveMax) {
        cellsEnergy[i] += RULES.energyGain;

        // Introduce small random chance of mutation/death even in ideal conditions
        if (random() < 0.01) {
          cell.shouldDie = true;
        }
      } else {
        // Harsh conditions drain more energy
        cellsEnergy[i] -= 1;
      }

      // Cap energy at maximum
      cellsEnergy[i] = min(cellsEnergy[i], RULES.maxEnergy);

      // Cell dies if energy is depleted
      if (cellsEnergy[i] <= 0) {
        cell.shouldDie = true;
      }
    } else {
      // Rules for dead cells
      // Birth requires specific neighbor count range based on type and season
      if (aliveNeighbors >= birthMin && aliveNeighbors <= birthMax) {
        // Add probability factor for birth
        const birthProbability = map(
          aliveNeighbors,
          birthMin,
          birthMax,
          0.6,
          0.9
        );

        if (random() < birthProbability) {
          cell.shouldBorn = true;

          // New cells inherit energy from neighbors
          cellsEnergy[i] = min(
            Math.floor(aliveNeighbors * 1.5),
            RULES.maxEnergy
          );
        }
      }
    }
  }
}

function getSeasonalModifiers() {
  // Calculate seasonal phase (0 to 1)
  const phase = seasonCycle / SEASON_LENGTH;

  // Create subtle variations in rules based on season cycle
  return {
    surviveMin: Math.floor(sin(phase * TWO_PI) * 0.5), // -0.5 to 0.5, rounded
    surviveMax: Math.floor(cos(phase * TWO_PI) * 0.5), // -0.5 to 0.5, rounded
    birthMin: Math.floor(sin(phase * TWO_PI + PI / 2) * 0.5), // -0.5 to 0.5, rounded
    birthMax: Math.floor(cos(phase * TWO_PI + PI / 2) * 0.5), // -0.5 to 0.5, rounded
  };
}

function getCellTypeModifiers(cellType) {
  // Different cell types have slightly different rule tendencies
  switch (cellType) {
    case 0: // Type 0: Standard cells
      return { surviveMin: 0, surviveMax: 0, birthMin: 0, birthMax: 0 };
    case 1: // Type 1: Explorative cells (easier birth, harder survival)
      return { surviveMin: 0, surviveMax: -1, birthMin: -1, birthMax: 1 };
    case 2: // Type 2: Stable cells (harder birth, easier survival)
      return { surviveMin: -1, surviveMax: 1, birthMin: 0, birthMax: -1 };
    default:
      return { surviveMin: 0, surviveMax: 0, birthMin: 0, birthMax: 0 };
  }
}

function updateCellStates() {
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];

    if (cell.shouldDie && cell.isAlive) {
      cell.isAlive = false;
      cellsEnergy[i] = 0;

      // Small chance dead cells release some energy particles
      if (random() < 0.3) {
        createParticles(
          cell.position.x * cellSpacing,
          cell.position.y * cellSpacing,
          cell.position.z * cellSpacing,
          "death"
        );
      }
    }

    if (cell.shouldBorn && !cell.isAlive) {
      cell.isAlive = true;

      // Add particle effects for newly born cells
      createParticles(
        cell.position.x * cellSpacing,
        cell.position.y * cellSpacing,
        cell.position.z * cellSpacing,
        "birth"
      );

      // Small chance of cell type mutation during birth
      if (random() < 0.1) {
        cellsType[i] = Math.floor(random(0, 3));
      }
    }
    // Special case: cell with very high energy can reproduce to empty neighbor
    else if (cell.isAlive && cellsEnergy[i] >= RULES.maxEnergy * 0.9) {
      // Find random empty neighbor
      const emptyNeighbor = findRandomEmptyNeighbor(cell);
      if (emptyNeighbor !== -1) {
        // 5% chance of reproduction when energy is high
        if (random() < 0.05) {
          cells[emptyNeighbor].isAlive = true;
          cells[emptyNeighbor].shouldBorn = false;
          cellsEnergy[emptyNeighbor] = Math.floor(cellsEnergy[i] * 0.5);
          cellsEnergy[i] = Math.floor(cellsEnergy[i] * 0.5);
          cellsType[emptyNeighbor] = cellsType[i]; // Inherit cell type

          // Add particle effects for reproduction
          const neighborCell = cells[emptyNeighbor];
          createParticles(
            neighborCell.position.x * cellSpacing,
            neighborCell.position.y * cellSpacing,
            neighborCell.position.z * cellSpacing,
            "reproduction"
          );
        }
      }
    }

    // Reset flags
    cell.shouldDie = false;
    cell.shouldBorn = false;
  }
}

function findRandomEmptyNeighbor(cell) {
  const { x, y, z } = cell.position;
  let emptyNeighbors = [];

  // Check all 26 neighbors
  for (let dz = -1; dz <= 1; dz++) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        // Skip the cell itself
        if (dx === 0 && dy === 0 && dz === 0) continue;

        const nx = x + dx;
        const ny = y + dy;
        const nz = z + dz;

        // Check bounds
        if (
          nx >= 0 &&
          nx < worldWidth &&
          ny >= 0 &&
          ny < worldHeight &&
          nz >= 0 &&
          nz < worldDepth
        ) {
          const neighborIndex =
            nx + ny * worldWidth + nz * worldWidth * worldHeight;
          if (!cells[neighborIndex].isAlive) {
            emptyNeighbors.push(neighborIndex);
          }
        }
      }
    }
  }

  // Return random empty neighbor or -1 if none
  if (emptyNeighbors.length > 0) {
    return emptyNeighbors[Math.floor(random(emptyNeighbors.length))];
  }
  return -1;
}

function countAliveNeighbors(cell) {
  let count = 0;
  const { x, y, z } = cell.position;

  // Check all 26 neighbors (3x3x3 cube excluding center)
  for (let dz = -1; dz <= 1; dz++) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        // Skip the cell itself
        if (dx === 0 && dy === 0 && dz === 0) continue;

        const nx = x + dx;
        const ny = y + dy;
        const nz = z + dz;

        // Check bounds
        if (
          nx >= 0 &&
          nx < worldWidth &&
          ny >= 0 &&
          ny < worldHeight &&
          nz >= 0 &&
          nz < worldDepth
        ) {
          const neighborIndex =
            nx + ny * worldWidth + nz * worldWidth * worldHeight;
          if (cells[neighborIndex].isAlive) {
            count++;
          }
        }
      }
    }
  }

  return count;
}

// ---- PARTICLE EFFECTS ----
function createParticles(x, y, z, type = "birth") {
  // Create particles with different characteristics based on type
  let particleCount, colorMod, speedMod, sizeMod, lifeMod;

  switch (type) {
    case "birth":
      particleCount = Math.floor(random(3, 5));
      colorMod = { r: 0, g: 255, b: 0 }; // Greenish
      speedMod = 1;
      sizeMod = 1;
      lifeMod = 1;
      break;
    case "death":
      particleCount = Math.floor(random(2, 4));
      colorMod = { r: 255, g: 0, b: 0 }; // Reddish
      speedMod = 0.7;
      sizeMod = 0.8;
      lifeMod = 0.7;
      break;
    case "reproduction":
      particleCount = Math.floor(random(4, 6));
      colorMod = { r: 0, g: 0, b: 255 }; // Bluish
      speedMod = 1.3;
      sizeMod = 1.2;
      lifeMod = 1.5;
      break;
    default:
      particleCount = Math.floor(random(2, 4));
      colorMod = { r: 255, g: 255, b: 255 };
      speedMod = 1;
      sizeMod = 1;
      lifeMod = 1;
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: x,
      y: y,
      z: z,
      vx: random(-0.08, 0.08) * speedMod,
      vy: random(-0.08, 0.08) * speedMod,
      vz: random(-0.08, 0.08) * speedMod,
      size: random(0.05, 0.15) * sizeMod,
      life: 200 * lifeMod,
      decay: random(5, 10),
      colorMod: colorMod,
    });
  }
}

function updateParticles() {
  // Update particle positions and lifetimes
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];

    // Move particle
    p.x += p.vx;
    p.y += p.vy;
    p.z += p.vz;

    // Apply slight gravity effect
    p.vy += 0.001;

    // Decay particle
    p.life -= p.decay;

    // Remove dead particles
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

// ---- CAMERA CONTROLS ----
function updateCamera() {
  // Create dynamic camera movement
  cameraPulse = sin(frameCount * 0.01) * 2; // Gentle pulsing

  // Camera rotation with occasional zoom-ins
  if (frameCount % 600 < 150) {
    // Gradually zoom in during certain frames
    zoomFactor = map(frameCount % 600, 0, 150, 0, 10);
  } else if (frameCount % 600 >= 150 && frameCount % 600 < 300) {
    // Hold zoom for a while
    zoomFactor = 10;
  } else if (frameCount % 600 >= 300 && frameCount % 600 < 450) {
    // Gradually zoom out
    zoomFactor = map(frameCount % 600, 300, 450, 10, 0);
  } else {
    // Normal distance
    zoomFactor = 0;
  }

  // Calculate camera position with orbit and pulse
  const effectiveCameraDistance = cameraDistance - zoomFactor;
  const camX = sin(frameCount * autoRotateX) * effectiveCameraDistance;
  const camZ = cos(frameCount * autoRotateX) * effectiveCameraDistance;
  const camY = sin(frameCount * autoRotateY) * 15 + cameraPulse;

  // Set camera position
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);
}

// ---- DRAWING ----
function draw() {
  // Update game state
  updateGame();

  // Setup scene
  background(0, 0, 0);

  // Update camera movement
  updateCamera();

  // Center the world
  const offsetX = (-worldWidth * cellSpacing) / 2;
  const offsetY = (-worldHeight * cellSpacing) / 2;
  const offsetZ = (-worldDepth * cellSpacing) / 2;

  // Add ambient environment
  // drawEnvironment();

  // Add lights
  ambientLight(80, 80, 100);
  directionalLight(255, 250, 235, 1, 0.5, -0.5);
  pointLight(
    180,
    180,
    255,
    sin(frameCount * 0.01) * 100,
    50,
    cos(frameCount * 0.01) * 100
  );

  // Draw cells with colors based on cell type and energy
  drawCells(offsetX, offsetY, offsetZ);

  // Draw particles
  drawParticles(offsetX, offsetY, offsetZ);

  // Display current generation and active cells count if desired
  // displayStats();
}

function drawCells(offsetX, offsetY, offsetZ) {
  // Draw all living cells with color effects based on cell type and energy
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    if (cell.isAlive) {
      push();

      // Cell position with offset to center
      translate(
        cell.position.x * cellSpacing + offsetX,
        cell.position.y * cellSpacing + offsetY,
        cell.position.z * cellSpacing + offsetZ
      );

      // Base color from position
      let r = map(cell.position.x, 0, worldWidth, 100, 255);
      let g = map(cell.position.y, 0, worldHeight, 100, 255);
      let b = map(cell.position.z, 0, worldDepth, 100, 255);

      // Modify color based on cell type
      const cellType = cellsType[i];
      switch (cellType) {
        case 0: // Standard - balanced
          // No change to RGB
          break;
        case 1: // Explorative - more red
          r = min(r + 50, 255);
          g = max(g - 20, 0);
          break;
        case 2: // Stable - more blue
          b = min(b + 50, 255);
          r = max(r - 20, 0);
          break;
      }

      // Energy level affects brightness and pulse
      const energyRatio = cellsEnergy[i] / RULES.maxEnergy;
      const energyPulse =
        sin(frameCount * 0.1 + cellsEnergy[i] * 0.2) * 0.2 + 0.6;

      // Cell size varies with energy
      const energySize = constrain(map(energyRatio, 0, 1, 0.6, 1.3), 0.6, 1.3);

      // Inner box with color based on type and energy
      fill(r, g, b, 100 + energyRatio * 120);
      box(cellSize * energySize * energyPulse);

      // Outer glow - brighter for high energy cells
      fill(r, g, b, 15 + energyRatio * 25);
      box(cellSize * (energySize + 0.3) * energyPulse);

      // Add extra bright core for cells with very high energy
      if (energyRatio > 0.8) {
        fill(255, 255, 255, 100 * (energyRatio - 0.8) * 5);
        box(cellSize * energySize * 0.4 * (1 + sin(frameCount * 0.2) * 0.2));
      }

      pop();
    }
  }
}

function drawParticles(offsetX, offsetY, offsetZ) {
  // Only process a maximum of 300 particles for performance
  const particlesToDraw = min(particles.length, 300);

  for (let i = 0; i < particlesToDraw; i++) {
    const p = particles[i];

    push();
    translate(p.x + offsetX, p.y + offsetY, p.z + offsetZ);

    // Determine color based on position and particle type
    const r = constrain(
      map(p.x, offsetX, -offsetX, 180, 255) + p.colorMod.r,
      0,
      255
    );
    const g = constrain(
      map(p.y, offsetY, -offsetY, 180, 255) + p.colorMod.g,
      0,
      255
    );
    const b = constrain(
      map(p.z, offsetZ, -offsetZ, 180, 255) + p.colorMod.b,
      0,
      255
    );

    // Fade out based on life
    const alpha = min(p.life, 150);

    fill(r, g, b, alpha);
    noStroke();
    //stroke(r, g, b, 10)
    sphere(p.size);
    pop();
  }
}

// ---- UTILITIES ----
function checkActivity() {
  // Count number of living cells
  let totalAlive = 0;
  let totalActiveEnergy = 0;

  for (let i = 0; i < cells.length; i++) {
    if (cells[i].isAlive) {
      totalAlive++;
      //totalActiveEnergy += cellsEnergy[i];
    }
  }

  // Calculate average energy of living cells
  // const avgEnergy = totalAlive > 0 ? totalActiveEnergy / totalAlive : 0;

  // Reset if too few cells are alive
  if (totalAlive <= 0 || generation > 1000) {
    console.log(
      "Resetting world - Generation: " +
        generation
    );
    randomizeCells(0.05);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  perspective(PI / 3, width / height, 0.1, 1000);
}
