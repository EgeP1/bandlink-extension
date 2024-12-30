import { CONFIG } from '../config/constants';
import { NetworkManager } from './networkManager';
import { MetricsCollector } from './metricsCollector';

export class NodeService {
  constructor() {
    this.networkManager = new NetworkManager();
    this.metricsCollector = new MetricsCollector();
    this.isRunning = false;
    this.peers = new Set();
  }

  async start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    await this.networkManager.initialize(CONFIG.DEFAULT_PORT);
    this.startMetricsCollection();
    this.connectToPeers();
  }

  stop() {
    this.isRunning = false;
    this.networkManager.disconnect();
    this.metricsCollector.stop();
    this.peers.clear();
  }

  private startMetricsCollection() {
    this.metricsCollector.start({
      onUpdate: (metrics) => this.handleMetricsUpdate(metrics),
      interval: CONFIG.UPDATE_INTERVAL
    });
  }

  private async connectToPeers() {
    const peers = await this.networkManager.discoverPeers();
    for (const peer of peers.slice(0, CONFIG.MAX_CONNECTIONS)) {
      this.peers.add(peer);
      this.networkManager.connect(peer);
    }
  }

  private handleMetricsUpdate(metrics) {
    chrome.runtime.sendMessage({
      type: 'METRICS_UPDATE',
      metrics
    });
  }
}