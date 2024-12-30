document.addEventListener('DOMContentLoaded', async () => {
  const nodeToggle = document.getElementById('nodeToggle');
  const statusBadge = document.getElementById('statusBadge');
  const dashboardBtn = document.getElementById('dashboardBtn');
  const jspiBtn = document.getElementById('jspiBtn');
  const featuresBtn = document.getElementById('featuresBtn');
  
  // Handle WASM settings buttons
  jspiBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: 'chrome://flags/#enable-experimental-webassembly-jspi' });
  });

  featuresBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: 'chrome://flags/#enable-experimental-webassembly-features' });
  });

  // Handle dashboard button click
  dashboardBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://app.bandlink.network' });
  });
  
  // Load initial state
  const stored = await chrome.storage.local.get(['isRunning']);
  nodeToggle.checked = stored.isRunning || false;
  updateStatus(stored.isRunning);
  
  if (stored.isRunning) {
    window.taskManager.start();
  }
  
  // Handle toggle changes
  nodeToggle.addEventListener('change', () => {
    const isRunning = nodeToggle.checked;
    chrome.storage.local.set({ isRunning });
    updateStatus(isRunning);
    
    if (isRunning) {
      window.taskManager.start();
    } else {
      window.taskManager.stop();
    }
  });
});

function updateStatus(isRunning) {
  const statusBadge = document.getElementById('statusBadge');
  statusBadge.textContent = isRunning ? 'Active' : 'Inactive';
  statusBadge.className = `status-badge ${isRunning ? 'active' : 'inactive'}`;
}