class TaskManager {
  constructor() {
    this.taskCount = 0;
    this.points = 0;
    this.worker = null;
  }

  start() {
    // Create a Web Worker for CPU-intensive tasks
    this.worker = new Worker('utils/worker.js');
    
    this.worker.onmessage = (e) => {
      if (e.data.type === 'TASK_COMPLETE') {
        this.taskCount++;
        this.points += e.data.points;
        window.metricsManager.updateTaskStats(this.taskCount, this.points);
      }
    };

    // Start metrics monitoring
    window.metricsManager.startMonitoring();
    
    // Start processing tasks
    this.worker.postMessage({ type: 'START_PROCESSING' });
  }

  stop() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    window.metricsManager.stopMonitoring();
  }
}

window.taskManager = new TaskManager();