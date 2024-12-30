class MetricsManager {
  constructor() {
    this.startTime = null;
    this.cpuInfo = null;
    this.lastCPUInfo = null;
    this.updateInterval = null;
  }

  async startMonitoring() {
    this.startTime = Date.now();
    this.updateTimer();
    
    // Start real-time monitoring
    this.updateInterval = setInterval(() => this.updateMetrics(), 1000);
  }

  stopMonitoring() {
    this.startTime = null;
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  async updateMetrics() {
    await this.updateCPUUsage();
    await this.updateMemoryUsage();
  }

  async updateCPUUsage() {
    return new Promise((resolve) => {
      chrome.system.cpu.getInfo((info) => {
        if (this.lastCPUInfo) {
          const cpuUsage = this.calculateCPUUsage(info);
          this.updateCPUDisplay(cpuUsage);
        }
        this.lastCPUInfo = info;
        resolve();
      });
    });
  }

  calculateCPUUsage(currentInfo) {
    let totalUsage = 0;
    const processors = currentInfo.processors;

    processors.forEach((processor, i) => {
      const current = processor.usage;
      const last = this.lastCPUInfo.processors[i].usage;

      const userUsage = current.user - last.user;
      const kernelUsage = current.kernel - last.kernel;
      const totalTime = userUsage + kernelUsage + (current.idle - last.idle);
      
      totalUsage += ((userUsage + kernelUsage) / totalTime) * 100;
    });

    return Math.round(totalUsage / processors.length);
  }

  async updateMemoryUsage() {
    chrome.system.memory.getInfo((info) => {
      const usedMemory = info.capacity - info.availableCapacity;
      const memoryPercentage = Math.round((usedMemory / info.capacity) * 100);
      this.updateMemoryDisplay(memoryPercentage);
    });
  }

  updateCPUDisplay(usage) {
    document.getElementById('cpuUsage').textContent = `${usage}%`;
    document.getElementById('cpuBar').style.width = `${usage}%`;
  }

  updateMemoryDisplay(usage) {
    document.getElementById('memoryUsage').textContent = `${usage}%`;
    document.getElementById('memoryBar').style.width = `${usage}%`;
  }

  updateTaskStats(completed, points) {
    document.getElementById('tasksCompleted').textContent = completed;
    document.getElementById('pointsEarned').textContent = points;
  }

  updateTimer() {
    if (!this.startTime) return;
    
    const minutes = Math.floor((Date.now() - this.startTime) / 60000);
    document.getElementById('timeActive').textContent = `${minutes}m`;
    setTimeout(() => this.updateTimer(), 60000);
  }
}

window.metricsManager = new MetricsManager();