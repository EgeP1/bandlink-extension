// CPU-intensive worker
function performTask() {
  // Simulate AI training with actual CPU usage
  const startTime = Date.now();
  let result = 0;
  
  // Run a computationally intensive task
  for (let i = 0; i < 10000000; i++) {
    result += Math.sqrt(i) * Math.sin(i);
  }
  
  const duration = Date.now() - startTime;
  return {
    points: Math.floor(duration / 100), // Points based on actual computation time
    result: result
  };
}

let isProcessing = false;

self.onmessage = function(e) {
  if (e.data.type === 'START_PROCESSING') {
    isProcessing = true;
    processLoop();
  } else if (e.data.type === 'STOP_PROCESSING') {
    isProcessing = false;
  }
};

async function processLoop() {
  while (isProcessing) {
    const result = performTask();
    
    self.postMessage({
      type: 'TASK_COMPLETE',
      points: result.points
    });

    // Add a small delay between tasks to prevent overwhelming the CPU
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}