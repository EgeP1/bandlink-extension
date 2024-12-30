import { fetchMockTask, submitMockResult } from './src/mocks/mockApi.js';

const TASK_INTERVAL = 5000; // 5 seconds
const MAX_CPU_USAGE = 0.3; // 30% max CPU usage

export class TaskManager {
  constructor(config) {
    this.onTaskComplete = config.onTaskComplete;
    this.onStatsUpdate = config.onStatsUpdate;
    this.isRunning = false;
    this.currentTask = null;
    this.worker = null;
  }

  async start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.worker = new Worker('worker.js');
    
    this.worker.onmessage = (e) => {
      if (e.data.type === 'TASK_COMPLETE') {
        this.handleTaskComplete(e.data.result);
      } else if (e.data.type === 'CPU_USAGE') {
        this.handleCpuUsage(e.data.usage);
      }
    };

    this.scheduleNextTask();
  }

  stop() {
    this.isRunning = false;
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.currentTask = null;
  }

  async scheduleNextTask() {
    if (!this.isRunning) return;

    try {
      const task = await fetchMockTask();
      if (task && this.isRunning) {
        this.currentTask = task;
        this.worker.postMessage({
          type: 'START_TASK',
          task
        });
      }
    } catch (error) {
      console.error('Error fetching task:', error);
      setTimeout(() => this.scheduleNextTask(), TASK_INTERVAL);
    }
  }

  handleTaskComplete(result) {
    submitMockResult(result).then(() => {
      this.onTaskComplete(result);
      setTimeout(() => this.scheduleNextTask(), TASK_INTERVAL);
    });
  }

  handleCpuUsage(usage) {
    this.onStatsUpdate({ cpuUsage: Math.round(usage * 100) });
    
    // Throttle if CPU usage is too high
    if (usage > MAX_CPU_USAGE) {
      this.worker.postMessage({ type: 'THROTTLE' });
    }
  }
}

export async function initializeTaskManager(config) {
  const manager = new TaskManager(config);
  return manager;
}