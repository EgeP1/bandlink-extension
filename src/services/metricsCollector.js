export class MetricsCollector {
  constructor() {
    this.interval = null;
    this.callbacks = new Set();
  }

  start({ onUpdate, interval }) {
    this.callbacks.add(onUpdate);
    this.interval = setInterval(() => this.collectMetrics(), interval);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.callbacks.clear();
  }

  private async collectMetrics() {
    const metrics = {
      timestamp: Date.now(),
      memory: await this.getMemoryUsage(),
      cpu: await this.getCpuUsage(),
      network: await this.getNetworkMetrics(),
      peers: await this.getPeerMetrics()
    };

    for (const callback of this.callbacks) {
      callback(metrics);
    }
  }

  private async getMemoryUsage() {
    const memory = await chrome.system.memory.getInfo();
    return {
      total: memory.capacity,
      used: memory.availableCapacity,
      percentage: (memory.availableCapacity / memory.capacity) * 100
    };
  }

  private async getCpuUsage() {
    return new Promise(resolve => {
      chrome.system.cpu.getInfo(info => {
        const usage = info.processors.reduce((acc, cpu) => acc + cpu.usage.user, 0) / info.processors.length;
        resolve({ percentage: usage });
      });
    });
  }

  private async getNetworkMetrics() {
    return new Promise(resolve => {
      chrome.system.network.getNetworkInterfaces(interfaces => {
        resolve({
          interfaces: interfaces.length,
          active: interfaces.filter(i => i.address).length
        });
      });
    });
  }

  private async getPeerMetrics() {
    // Implement peer metrics collection
    return {
      connected: 0,
      active: 0,
      latency: 0
    };
  }
}