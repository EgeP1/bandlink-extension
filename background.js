// Initialize extension state
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    isRunning: false,
    taskCount: 0,
    points: 0,
    startTime: null
  });
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_STATS') {
    chrome.storage.local.get(['taskCount', 'points', 'startTime'], (result) => {
      sendResponse(result);
    });
    return true;
  }
});