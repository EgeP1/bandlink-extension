// Web Worker for handling CPU-intensive tasks
let isThrottled = false;
let currentTask = null;

// Import WASM module
importScripts('wasmModule.js');

// Monitor CPU usage
async function monitorCpuUsage() {
  while (true) {
    const startTime = performance.now();
    let count = 0;
    
    // Simple CPU usage estimation
    while (performance.now() - startTime < 1000) {
      count++;
      if (isThrottled) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    const usage = 1 - (count / 1000000); // Rough estimate
    postMessage({ type: 'CPU_USAGE', usage });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Handle messages from TaskManager
onmessage = async function(e) {
  switch (e.data.type) {
    case 'START_TASK':
      currentTask = e.data.task;
      const result = await processTask(currentTask);
      postMessage({ 
        type: 'TASK_COMPLETE',
        result
      });
      break;
      
    case 'THROTTLE':
      isThrottled = true;
      setTimeout(() => { isThrottled = false; }, 5000);
      break;
  }
};

// Process AI training task
async function processTask(task) {
  // Use WASM module for computation
  const result = await wasmModule.processTask(task);
  
  return {
    taskId: task.id,
    result: result,
    points: calculatePoints(result)
  };
}

function calculatePoints(result) {
  // Simple point calculation based on task complexity
  return Math.floor(result.complexity * 10);
}

// Start CPU monitoring
monitorCpuUsage();