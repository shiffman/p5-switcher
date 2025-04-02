let leaves = [];
let currentBatch = 1; // 当前正在下落的叶子批次
let numLeavesPerBatch = 20; // 每批生成的叶子数量
let fadeSpeed = 1; // 每帧减少的 fade 值

function setup() {
  createCanvas(windowWidth, windowHeight);
  // 初始化第一批叶子，从顶部生成
  spawnNewBatch();
}

function draw() {
  background(0);
  
  // 记录当前批次是否全部落地
  let currentBatchAllStopped = true;
  
  // 遍历所有叶子
  for (let i = leaves.length - 1; i >= 0; i--) {
    let leaf = leaves[i];
    
    // 对于未落地的叶子，执行 wander() 让它继续运动
    if (!leaf.stopped) {
      leaf.wander();
    }
    
    leaf.update();
    leaf.edges();
    leaf.show();
    
    // 如果该叶子属于当前批次且还未落地，则当前批次还没全部停止
    if (leaf.batch === currentBatch && !leaf.stopped) {
      currentBatchAllStopped = false;
    }
    
    // 对于已经落地且属于旧批次（非当前批次）的叶子，降低 fade 值
    if (leaf.stopped && leaf.batch < currentBatch) {
      leaf.fade = max(0, leaf.fade - fadeSpeed);
      // 当完全透明时，从数组中删除该叶子
      if (leaf.fade === 0) {
        leaves.splice(i, 1);
      }
    }
  }
  
  // 如果所有当前批次的叶子都落地，则生成新一批叶子，并更新 currentBatch
  if (currentBatchAllStopped) {
    currentBatch++; // 开启新批次
    spawnNewBatch();
  }
}

// 生成一批新的叶子，它们的 batch 都为当前 currentBatch
function spawnNewBatch() {
  for (let i = 0; i < numLeavesPerBatch; i++) {
    // 叶子从顶部生成，x 为随机值，y 固定为 0
    let leaf = new Vehicle(random(width), 0);
    leaf.batch = currentBatch; // 设置所属批次
    leaves.push(leaf);
  }
}

